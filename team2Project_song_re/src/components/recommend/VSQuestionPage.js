import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vsQuestions } from "./VSQuestions";
import { useLoginContext } from "../../contexts/LoginContext";

const VSQuestionPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useLoginContext();

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scoreSelected, setScoreSelected] = useState([]);
  const [emotionalSelected, setEmotionalSelected] = useState([]);
  const [recommendResult, setRecommendResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ 게스트 ID + 질문 셔플
  useEffect(() => {
    if (!loginUser) {
      let sessionId = localStorage.getItem("guest_session_id");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("guest_session_id", sessionId);
      }
    }

    const shuffled = [...vsQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
    setShuffledQuestions(shuffled);
  }, [loginUser]);

  // ✅ 선택 처리
  const handleSelect = (option) => {
    if (isSubmitting || currentIndex >= shuffledQuestions.length) return;

    const current = shuffledQuestions[currentIndex];
    const nextIndex = currentIndex + 1;

    if (current.type === "score") {
      setScoreSelected([...scoreSelected, option]);
    } else {
      setEmotionalSelected([...emotionalSelected, option]);
    }

    setCurrentIndex(nextIndex);
  };

  // ✅ 추천 요청
  const handleSubmit = async () => {
    const totalSelected = scoreSelected.length + emotionalSelected.length;
    if (totalSelected !== 10) {
      alert("정확히 10개의 문항에 응답해야 합니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        score_keywords: scoreSelected,
        emotional_keywords: emotionalSelected,
        user_id: loginUser?.user_no ?? null,
      };

      const res = await fetch("http://localhost:8000/trip/agent-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ FastAPI 오류 응답:", errText);
        throw new Error("FastAPI 추천 실패");
      }

      const result = await res.json();
      console.log("🎯 추천 결과:", result);

      if (!result?.trip?.trip_no) {
        alert("추천 결과가 없습니다. 다시 시도해주세요.");
        return;
      }

      // 로그 저장
      await fetch("http://localhost:9093/recommend-log/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_no: loginUser?.user_no || null,
          session_id: loginUser ? null : localStorage.getItem("guest_session_id"),
          trip_no: result.trip.trip_no,
          keywords: JSON.stringify([...scoreSelected, ...emotionalSelected]),
          result_summary: result.summary,
        }),
      });

      setRecommendResult(result);
    } catch (err) {
      console.error("🚨 추천 처리 오류:", err.message);
      alert("AI 추천에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToDetail = () => {
    if (!recommendResult) return;
    navigate(`/ai-recommend/${recommendResult.trip.trip_no}`, {
      state: {
        from: "recommend",
        trip: recommendResult.trip,
        summary: recommendResult.summary,
        user_no: loginUser?.user_no || null,
      },
    });
  };

  const getEmojiForKeyword = (keyword) => {
    const emojiMap = {
      "감성": "🌿", "자연": "🏞️", "맛집": "🍜", "풍경": "📷", "역사": "🏛️", "문화": "🎨",
      "포토존": "📸", "여유": "😌", "힐링": "🧘", "레저": "🏄", "가족": "👨‍👩‍👧‍👦", "젊음": "🎉",
      "전통": "🧧", "예술": "🖼️", "벚꽃": "🌸", "가을": "🍁", "트레킹": "🥾", "드라이브": "🚗",
      "휴양": "🌴", "핫플": "🔥", "전망": "🔭", "산책": "🚶", "먹거리": "🍢", "카페": "☕",
      "축제": "🎊", "고요함": "🌌", "시장": "🛍️", "쇼핑": "🛒", "도보": "👟", "유람선": "🚤",
      // 감성형 응답 일부 예시
      "감성을 깨우는 풍경과 분위기를 원해요": "🌿",
      "액티비티와 음식으로 스트레스를 풀고 싶어요": "🍔",
      "도심 속 감성 공간들": "🏙️",
      "자연 속 이색 장소": "🌲",
    };
    return emojiMap[keyword] || "✨";
  };

  if (shuffledQuestions.length === 0) return <div>로딩 중...</div>;

  const currentQuestion = shuffledQuestions[currentIndex];

  return (
    <div className="vs-container">
      {currentIndex < 10 ? (
        <>
          <h2>여행 성향 질문 {currentIndex + 1} / 10</h2>
          <div className="vs-question">
            <p>{currentQuestion.question}</p>
            <div className="vs-options">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  className="vs-option-btn"
                  onClick={() => handleSelect(opt)}
                  disabled={isSubmitting}
                >
                  <div className="vs-option-emoji">{getEmojiForKeyword(opt)}</div>
                  <div className="vs-option-text">{opt}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="vs-result-ready">
          <h2>AI 추천 결과를 확인해보세요!</h2>
          {!recommendResult ? (
            <button className="vs-submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
              AI 분석 결과 보기
            </button>
          ) : (
            <button className="vs-submit-btn" onClick={goToDetail}>
              추천된 여행지로 이동 →
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VSQuestionPage;
