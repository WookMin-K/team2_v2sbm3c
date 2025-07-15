-- ✅ 기존 테이블 제거 (있을 경우)
DROP TABLE recommend_log CASCADE CONSTRAINTS;

-- ✅ 추천 로그 테이블 생성
CREATE TABLE recommend_log (
  log_id          NUMBER PRIMARY KEY,              -- 추천 로그 고유번호 (PK)
  user_no         NUMBER,                          -- 회원 번호 (nullable)
  session_id      VARCHAR2(100),                   -- 비회원 세션 식별자
  keywords        CLOB,                            -- 선택된 VS 키워드 결과 (JSON 형식 문자열)
  trip_no         NUMBER NOT NULL,                 -- 추천된 여행지 번호
  result_summary  VARCHAR2(200),                   -- AI 분석 요약 문장
  timestamp       DATE DEFAULT SYSDATE             -- 추천 발생 시간
);

-- ✅ 컬럼 주석 추가
COMMENT ON TABLE recommend_log IS 'AI Agent 기반 추천 로그 저장 테이블';
COMMENT ON COLUMN recommend_log.log_id IS '추천 로그 고유번호 (PK)';
COMMENT ON COLUMN recommend_log.user_no IS '회원 번호 (nullable)';
COMMENT ON COLUMN recommend_log.session_id IS '비회원 세션 식별자';
COMMENT ON COLUMN recommend_log.keywords IS '사용자 선택 키워드 (JSON 문자열)';
COMMENT ON COLUMN recommend_log.trip_no IS '추천된 여행지 번호';
COMMENT ON COLUMN recommend_log.result_summary IS 'AI 성향 분석 요약 문장';
COMMENT ON COLUMN recommend_log.timestamp IS '추천 발생 시간';

-- ✅ 시퀀스 생성
CREATE SEQUENCE recommend_log_seq
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

-- ✅ 외래키 설정 (users, trip이 존재할 경우)
ALTER TABLE recommend_log
ADD CONSTRAINT fk_recommend_user
FOREIGN KEY (user_no)
REFERENCES users(user_no);

ALTER TABLE recommend_log
ADD CONSTRAINT fk_recommend_trip
FOREIGN KEY (trip_no)
REFERENCES trip(trip_no);

-- 컬럼 길이를 500자 이상으로 확장
ALTER TABLE recommend_log MODIFY result_summary VARCHAR2(2000);

commit;
