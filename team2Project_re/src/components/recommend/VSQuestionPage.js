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
  const [originalQuestions, setOriginalQuestions] = useState([]);

// useEffect
useEffect(() => {
  if (!loginUser && !localStorage.getItem("guest_session_id")) {
    // window.crypto가 있으면 native UUID, 없으면 간단한 폴백
    const uuid = window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : `fallback_${Math.random().toString(36).slice(2)}`;
    const newSessionId = `guest_${uuid}`;
    localStorage.setItem("guest_session_id", newSessionId);
  }
// useEffect(() => {
//   if (!loginUser && !localStorage.getItem("guest_session_id")) {
//     const newSessionId = `guest_${crypto.randomUUID()}`;
//     localStorage.setItem("guest_session_id", newSessionId);
//   }

  const shuffled = [...vsQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
  setShuffledQuestions(shuffled);
}, [loginUser]);

// handleSelect
const handleSelect = (option) => {
  if (isSubmitting || currentIndex >= 10) return;

  const current = shuffledQuestions[currentIndex];
  const nextIndex = currentIndex + 1;

  if (current.type === "score") {
    setScoreSelected([...scoreSelected, option]);
  } else {
    setEmotionalSelected([...emotionalSelected, option]);
  }

  setOriginalQuestions(prev => [...prev, { question: current.question, answer: option }]);
  setCurrentIndex(nextIndex);
};

// handleSubmit (간결화된 sessionId 처리 포함)
const handleSubmit = async () => {
  const totalSelected = scoreSelected.length + emotionalSelected.length;
  if (totalSelected !== 10) {
    alert("정확히 10개의 문항에 응답해야 합니다.");
    return;
  }

  setIsSubmitting(true);
  try {
    const isLoggedIn = !!loginUser?.user_no;
    const sessionId = isLoggedIn ? null : localStorage.getItem("guest_session_id");

    const payload = {
      user_no: isLoggedIn ? Number(loginUser.user_no) : null,
      session_id: sessionId,
      user_name: loginUser && loginUser.name ? loginUser.name : "여행자",
      score_keywords: scoreSelected,
      emotional_keywords: emotionalSelected,
      selected_questions: originalQuestions
    };

    const res = await fetch("http://121.78.128.95:8000/trip/agent-recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();

      if (res.status === 429) {
        const isLoggedIn = !!loginUser?.user_no;

        if (isLoggedIn) {
          alert("✨ 오늘의 AI 추천 3회를 모두 사용하셨어요.\n내일 다시 새로운 여행지를 추천해드릴게요!");
        } else {
          alert("🔐 비회원 AI 추천은 하루에 1회만 제공돼요.\n로그인하면 더 많은 추천을 받을 수 있어요!");
        }

      } else {
        throw new Error(`FastAPI 추천 실패: ${errText}`);
      }
      return;
    }


    const result = await res.json();
    if (!result?.trip?.trip_no) {
      alert("추천 결과가 없습니다. 다시 시도해주세요.");
      return;
    }

    setRecommendResult(result);
  } catch (err) {
    console.error("🚨 추천 오류:", err.message);
    alert("AI 추천에 실패했습니다.");
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
        reason: recommendResult.reason,
        score: recommendResult.score,
        rank: recommendResult.rank,
        festival: recommendResult.festival,
        matched_keywords: recommendResult.matched_keywords,
        user_no: loginUser?.user_no || null,
        keywords: [...scoreSelected, ...emotionalSelected],
      },
    });

  };

  const getEmojiForKeyword = (keyword) => {
    const emojiMap = {
      "감성": "✨", "자연": "🌿", "맛집": "🥢", "풍경": "🌄", "역사": "🏺", "문화": "🎨",
      "포토존": "📷", "여유": "🌙", "힐링": "🧘", "레저": "🛶", "가족": "🏡", "젊음": "🧃",
      "전통": "🎐", "예술": "🧵", "벚꽃": "🌸", "가을": "🍂", "트레킹": "⛰️", "드라이브": "🛣️",
      "휴양": "🏖️", "핫플": "🔥", "전망": "🔭", "산책": "👣", "먹거리": "🍙", "카페": "🥤",
      "축제": "🎊", "고요함": "🕯️", "시장": "🧺", "쇼핑": "🛍️", "도보": "🧍‍♂️", "유람선": "⛴️",
      "감성을 깨우는 풍경과 분위기를 원해요": "🌿",
      "액티비티와 음식으로 스트레스를 풀고 싶어요": "🍲",
      "도심 속 감성 공간들": "🏙️",
      "자연 속 이색 장소": "🌲",
    };
    return emojiMap[keyword] || "✨";
  };

  if (shuffledQuestions.length === 0) return <div className="vs-loading">로딩 중...</div>;

  const currentQuestion = shuffledQuestions[currentIndex];

  return (
    <div className="vs-container">
      {currentIndex < 10 ? (
        <>
          <h2 className="vs-progress">여행 성향 질문 {currentIndex + 1} / 10</h2>
          <div className="vs-question">
            <p className="vs-question-text">{currentQuestion.question}</p>
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
            <>
              {isSubmitting && (
                <>
                  <div className="vs-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <p className="vs-waiting-msg">AI가 여행지를 분석하고 있어요...</p>
                </>
              )}
              <button className="vs-submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "분석 중..." : "AI 분석 결과 보기"}
              </button>
            </>
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
