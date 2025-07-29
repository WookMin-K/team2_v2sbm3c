// TripModal.js
import React, { useEffect, useState } from 'react';
import { LineChartCom, PieChartCom } from './ChartComponents';
import { Top5List, InsightBox } from './Top5Components';
import './TripModal.css';
import BookmarkButton from './bookmark/bookmarkbutton';

/**
 * TripModal 컴포넌트
 * - 여행지 상세 정보 모달을 출력
 * - 이미지, 차트, 인기 장소, AI 분석 결과 등 5개 슬라이드 제공
 */
function TripModal({ trip, onClose, user_no }) {
  const [slideIndex, setSlideIndex] = useState(0);              // 현재 슬라이드 인덱스
  const [zoomedImage, setZoomedImage] = useState(null);         // 이미지 확대 여부
  const { PUBLIC_URL } = process.env;

  // ESC 키로 모달 닫기 기능
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!trip) return null; // trip 데이터 없으면 아무것도 렌더링하지 않음

  // 여행지 이미지 경로 설정
  const baseImage = trip.image
    ? `${PUBLIC_URL}/images_g/${trip.image}`
    : `${PUBLIC_URL}/images/default.png`;

  // 슬라이드 구성: 이미지, 선형 차트, 파이 차트, Top5, AI 문장
  const slides = [
    { type: 'image', content: baseImage },
    { type: 'chart-line', content: trip.chart },
    { type: 'chart-pie', content: trip.piechart },
    { type: 'top5', content: trip.top5 },
    { type: 'insight', content: trip.insight }
  ];

  const currentSlide = slides[slideIndex];
  const formattedDate = new Date(trip.tnew).toLocaleDateString('ko-KR');

  // 슬라이드별 렌더링 함수
  const renderSlide = ({ type, content }) => {
    switch (type) {
      case 'image':
        return (
          <img
            src={content}
            alt="여행지 이미지"
            onClick={() => setZoomedImage(content)}
            style={{ cursor: 'zoom-in', maxWidth: '100%', maxHeight: '300px' }}
          />
        );
      case 'chart-line':
        return <LineChartCom data={content} />;
      case 'chart-pie':
        return <PieChartCom data={content} />;
      case 'top5':
        return <Top5List data={content} />;
      case 'insight':
        return <InsightBox content={content} />;

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          {/* 좌측 영역: 텍스트 정보 */}
          <div className="modal-left">
            <h1>{trip.tname}</h1>
            <h2>{trip.sname}</h2>
            <p>{trip.intro}</p>
            <div className="modal-left-down">
              <p><strong>등록일:</strong> {formattedDate}</p>
              <p><strong>조회수:</strong> {trip.viewcnt ?? 0}</p>

              <BookmarkButton user_no={user_no} trip_no={trip.trip_no} />
            </div>
          </div>

          {/* 우측 영역: 슬라이드 + 버튼 */}
          <div className="modal-right">
            {/* 탭 선택 */}
            <div className="slide-tabs">
              {['사진', '월별 방문객', '검색 비율', 'Top5 핫플', 'AI 분석'].map((label, idx) => (
                <button
                  key={idx}
                  className={`slide-tab ${slideIndex === idx ? 'active' : ''}`}
                  onClick={() => setSlideIndex(idx)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 슬라이드 콘텐츠 */}
            <div className="slide-content-wrapper">
              <div className="slide-content">
                {renderSlide(currentSlide)}
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="slider-controls">
              {trip.url_1 && (
                <a href={trip.url_1} target="_blank" rel="noopener noreferrer" className="slide-tab active">
                  맛집 순위
                </a>
              )}
              {trip.url_2 && (
                <a href={trip.url_2} target="_blank" rel="noopener noreferrer" className="slide-tab active">
                  숙소 예약
                </a>
              )}
              <button onClick={onClose} className="slide-tab active">닫기</button>
            </div>
          </div>
        </div>

        {/* 이미지 확대 모달 */}
        {zoomedImage && (
          <div className="zoom-modal" onClick={() => setZoomedImage(null)}>
            <img src={zoomedImage} className="zoomed" alt="확대 이미지" />
          </div>
        )}
      </div>
    </div>
  );
}

export default TripModal;

//uvicorn main:app --reload --port 8000
