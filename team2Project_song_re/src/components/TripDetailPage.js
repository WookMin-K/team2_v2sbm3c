import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TripModal from './TripModal';

function TripDetailPage() {
  const { trip_no } = useParams();
  const [trip, setTrip] = useState(null);
  const [summary, setSummary] = useState('');
  const [reason, setReason] = useState('');
  const [showModal, setShowModal] = useState(false);

// 1. trip 정보 먼저 불러오기
useEffect(() => {
  const fetchTrip = async () => {
    try {
      const res = await fetch(`http://localhost:9093/trip/read?trip_no=${trip_no}`);
      const data = await res.json();
      setTrip(data);
    } catch (err) {
      console.error('🚨 여행지 정보 불러오기 실패:', err);
    }
  };

  fetchTrip();
}, [trip_no]);

// 2. trip이 불러와진 후 분석 및 요약 정보 요청
useEffect(() => {
  if (!trip) return;

  // 분석 데이터 요청 (chart, pie, top5, insight)
  // 분석 데이터 요청 (chart, pie, top5, insight)
  const fetchInsight = async () => {
    try {
      const res = await fetch(`http://localhost:8000/trip/agent-analysis?trip_no=${trip.trip_no}`);
      if (!res.ok) throw new Error('분석 데이터 응답 실패');
      const data = await res.json();

      setTrip(prev => ({
        ...prev,
        chart: data.chart,
        pie: data.piechart,
        top5: data.top5,
        insight: data.insight,
      }));
    } catch (err) {
      console.error('🚨 분석 요약 불러오기 실패:', err.message);
    }
  };


  // 요약 문구 요청
  const fetchSummary = async () => {
    try {
      const res = await fetch(`http://localhost:8000/trip/agent-recommend/summary?trip_no=${trip.trip_no}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || '요약 실패');
      }
      const data = await res.json();
      setSummary(data.summary);
      setReason(data.reason);
    } catch (err) {
      console.error('🚨 추천 요약 불러오기 실패:', err.message);
      setSummary("이 여행지는 현재 분석 대상에서 제외되었습니다.");
      setReason("");
    }
  };

  fetchInsight();
  fetchSummary();
}, [trip]);


  if (!trip) return <div>로딩 중...</div>;

  return (
    <div className="recommend-detail">
      <div className="recommend-header">
        <h2 className="recommend-title">🎯 AI 추천 여행지: <span>{trip.sname}</span></h2>
        {reason && <p className="recommend-reason">{reason}</p>}
      </div>

      <div className="recommend-summary">
        {summary
          ? summary.split('\n').map((line, idx) => <p key={idx}>{line}</p>)
          : '분석 데이터를 불러오는 중입니다.'}
      </div>

      <div className="recommend-image-wrapper">
        <img
          src={`${process.env.PUBLIC_URL}/images_g/${trip.image}`}
          onClick={() => setShowModal(true)}
          className="recommend-image"
          alt="추천 여행지"
        />
      </div>

      <div className="recommend-actions">
        <button onClick={() => setShowModal(true)} className="recommend-btn info">
          전체 정보 보기
        </button>
        <button
          onClick={() => window.location.href = `/plan/create?trip_no=${trip.trip_no}`}
          className="recommend-btn plan"
        >
          여행 일정 만들기
        </button>
</div>

      {showModal && (
        <TripModal
          trip={trip}
          onClose={() => setShowModal(false)}
          user_no={null} // 북마크 제거로 인해 user_no 제거
        />
      )}
    </div>
  );
}

export default TripDetailPage;
