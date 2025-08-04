import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoginContext } from '../contexts/LoginContext';
import TripModal from './TripModal';
import './TripDetailPage.css';

function TripDetailPage() {
  const location = useLocation();
  const { loginUser } = useLoginContext();

  const [tripDetail, setTripDetail] = useState(null);
  const [summary, setSummary] = useState('');
  const [reason, setReason] = useState('');
  const [score, setScore] = useState(null);
  const [rank, setRank] = useState(null);
  const [festival, setFestival] = useState('');
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const state = location.state;
    if (!state || !state.trip) {
      setHasError(true);
      return;
    }

    setTripDetail({
      ...state.trip,
      summary: state.summary,
      reason: state.reason,
      score: state.score,
      rank: state.rank,
      festival: state.festival,
      matchedKeywords: state.matched_keywords || [],
    });

    setSummary(state.summary);
    setReason(state.reason);
    setScore(state.score);
    setRank(state.rank);
    setFestival(state.festival);
    setMatchedKeywords(state.matched_keywords || []);
    setKeywords(state.keywords || []);
    setLoading(false);
  
    fetch(`http://121.78.128.95:9093/trip/read?trip_no=${state.trip.trip_no}`)
      .then(res => res.json())
      .then(springData => {
        setTripDetail(prev => ({ ...prev, ...springData }));
      })
      .catch(err => console.warn("Spring trip read 실패:", err.message));

    fetch(`http://121.78.128.95:8000/trip/agent-analysis?trip_no=${state.trip.trip_no}`)
      .then(res => res.json())
      .then(insightData => {
        setTripDetail(prev => ({
          ...prev,
          chart: insightData.chart,
          piechart: insightData.piechart,
          top5: insightData.top5,
          insight: insightData.insight,
        }));
      })
      .catch(e => console.warn("분석 데이터 로딩 실패:", e.message));
  }, [location.state]);

  const handleLike = async () => {
    try {
      const user_no = loginUser?.user_no ?? null;
      let session_id = localStorage.getItem("session_id");
      if (!session_id) {
        session_id = `guest_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem("session_id", session_id);
      }

      const res = await fetch("http://121.78.128.95:9093/recommend-log/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_no,
          session_id,
          trip_no: tripDetail.trip_no,
          keywords: JSON.stringify(keywords),
          result_summary: summary,
        }),
      });

      if (!res.ok) throw new Error("서버 응답 실패");
      alert("✅ 여행지를 마음에 들어요로 저장했어요!");
      setLiked(true);
    } catch (err) {
      console.error("저장 실패:", err.message);
      alert("저장에 실패했어요. 다시 시도해주세요.");
    }
  };

  function highlightSummary(text, sname, keywords) {
    const keywordSet = new Set(keywords);
    return text.split('\n').map((line, idx) => {
      const tokens = line.split(/(\s+)/);
      const highlighted = tokens.map((word, i) => {
        const clean = word.replace(/[^\w가-힣]/g, '');
        if (clean === sname) return <span key={i} className="highlight-region">{word}</span>;
        if (keywordSet.has(clean)) return <span key={i} className="highlight-keyword">{word}</span>;
        return word;
      });
      return <p key={idx}>{highlighted}</p>;
    });
  }

  if (hasError) return <div className="recommend-error">추천 정보를 불러오지 못했습니다. 나중에 다시 시도해주세요.</div>;
  if (!tripDetail) return <div className="recommend-loading">여행지 정보를 불러오는 중입니다...</div>;

  return (
    <div className="recommend-container animate-slide-up">
      <h2 className="recommend-title centered">
        🧭 <strong>Travel AI</strong>가 추천하는 여행지: <span className="highlight-region">{tripDetail.sname}</span>
      </h2>

      <div className="recommend-grid">
        <div className="recommend-left">
          <div className="recommend-image-wrapper">
            {tripDetail.image ? (
              <img
                src={`${process.env.PUBLIC_URL}/images_g/${tripDetail.image}`}
                onClick={() => setShowModal(true)}
                className="recommend-image"
                alt="추천 여행지"
              />
            ) : (
              <div className="image-placeholder">이미지가 준비되지 않았습니다.</div>
            )}
          </div>

          <section className="recommend-tags">
            <div className="tag-box matched-keywords-group">
              <span className="tag-label-text">🍀 나와 잘 맞는 감성 키워드</span>
              <div className="matched-keywords">
                {matchedKeywords.map((kw, i) => <span key={i} className="keyword-match">#{kw}</span>)}
              </div>
            </div>

            <div className="tag-box user-keywords-group">
              <span className="tag-label-text">📌 내가 선택한 키워드</span>
              <div className="recommend-keywords">
                {keywords.map((k, i) => <span key={i} className="keyword-badge">#{k}</span>)}
              </div>
            </div>
          </section>
        </div>

        <div className="recommend-right">
          <section className="recommend-summary">
            {!loading && summary ? (
              highlightSummary(summary, tripDetail.sname, matchedKeywords)
            ) : (
              <p>AI가 추천 문장을 준비하고 있어요. 잠시만 기다려 주세요...</p>
            )}
          </section>

          <section className="recommend-metrics">
            <div className="metric">
              <label>🎯 추천 점수</label>
              <progress value={score ?? 0} max="100"></progress>
              <span>{typeof score === 'number' ? `${score.toFixed(2)}%` : '계산 중...'}</span>
            </div>
            <div className="metric">
              <label>📈 검색량 순위</label>
              <span>{rank ? `${rank}위` : '정보 없음'}</span>
            </div>
            <div className="metric">
              <label>🎉 관련 축제</label>
              <span>{festival || '없음'}</span>
            </div>
          </section>

          <div className="recommend-actions">
            <button onClick={() => setShowModal(true)} className="recommend-btn info">🔍 정보 보기</button>
            <button onClick={() => window.location.href = `/schedule`} className="recommend-btn plan">📝 여행 일정 만들기</button>
            <button onClick={handleLike} className="recommend-btn like" disabled={liked}>
              {liked ? '💖 다음 추천에 참고할게요!' : '❤️ 마음에 들어요'}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <TripModal
          trip={tripDetail}
          onClose={() => setShowModal(false)}
          user_no={loginUser?.user_no ?? null}
        />
      )}

      <footer className="recommend-footer">
        모두를 위한 여행, 당신만을 위한 <strong>Travel AI</strong>
      </footer>
    </div>
  );
}

export default TripDetailPage;
