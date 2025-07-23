import pandas as pd
import numpy as np
import oracledb
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import ast



# ✅ Oracle DB 연결
dsn = "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=121.78.128.150)(PORT=1521))(CONNECT_DATA=(SID=xe)))"
conn = oracledb.connect(user="team2", password="69017000", dsn=dsn)
cursor = conn.cursor()

# ✅ recommend_log 테이블에서 데이터 조회
query = """
SELECT log_id, user_no, keywords, trip_no
FROM recommend_log
WHERE trip_no IS NOT NULL
"""
cursor.execute(query)
rows = cursor.fetchall()
columns = ['log_id', 'user_no', 'keywords', 'trip_no']
df = pd.DataFrame(rows, columns=columns)

# ✅ 결측치 제거
df.dropna(subset=['keywords', 'trip_no'], inplace=True)

# ✅ 라벨 인코딩 (trip_no → trip_label)
le = LabelEncoder()
df['trip_label'] = le.fit_transform(df['trip_no'])

# ✅ 키워드 전처리 (쉼표 → 공백)
df['keywords'] = df['keywords'].astype(str).str.replace(",", " ")

# ✅ 리스트 문자열을 공백으로 연결된 키워드로 변환
def clean_keywords(kw_str):
    try:
        keywords_list = ast.literal_eval(kw_str)  # 리스트형 문자열 → 실제 리스트
        return " ".join(keywords_list)
    except:
        return ""

df['keywords'] = df['keywords'].astype(str).apply(clean_keywords)

# ✅ TF-IDF 벡터화
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df['keywords'])
y = df['trip_label']

# ✅ 학습 데이터 분리
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ✅ 모델 학습 (랜덤포레스트)
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# ✅ 평가
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)
print(f"\n✅ 정확도: {acc:.4f}")
print("📊 분류 리포트:\n", report)

# ✅ 모델 저장
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/recommend_model.pkl")
joblib.dump(vectorizer, "models/keyword_vectorizer.pkl")
joblib.dump(le, "models/trip_label_encoder.pkl")
print("\n✅ 모델 및 벡터라이저 저장 완료 (models/ 디렉토리)")
