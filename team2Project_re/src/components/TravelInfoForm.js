import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import LocationSelect from './LocationSelect';
import CalendarModal from './CalendarModal';
import IconSelect from './IconSelect';
import { useNavigate } from 'react-router-dom';
import { TRANSPORT_OPTIONS, PERSON_COUNT_OPTIONS } from '../constants/formOptions';
import DaumPostcode from 'react-daum-postcode';

import '../styles/travelInfoForm.css';

const TravelInfoForm = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState(null);
  const [departure, setDeparture] = useState('');      // ✅ 문자열로 수정
  const [transport, setTransport] = useState('');
  const [persons, setPersons] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  
  const [generatedSchedule, setGeneratedSchedule] = useState(null); // ✅ 추가된 state

  const location = useLocation();
  const { selectedSpots } = location.state || { selectedSpots: [] };
  const [spots, setSpots] = useState(selectedSpots);

  const [isAddressOpen, setIsAddressOpen] = useState(false);  // 모달 on/off

  // ✅ 제출 중 로딩 상태
  const [isSubmitting, setIsSubmitting] = useState(false);


  // 제목 입력을 위한 state
  const [planTitle, setPlanTitle] = useState('');

  console.log('✅ 전달받은 장소 목록:', spots);

const handleSubmit = async () => {
  if (!planTitle.trim() || !dateRange || !departure || !transport || !persons || spots.length === 0) {
    alert('모든 정보를 입력해 주세요!');
    return;
  }

  // 로딩 시작
  setIsSubmitting(true);

  const payload = {
    title: planTitle,
    // departure: `${departure.city} ${departure.district}`,
    departure: departure, 
    dateRange,
    transport,
    persons: Number(persons),
    spots: spots.map((spot, idx) => ({
      id: spot.id || idx,  // 없는 경우 인덱스로라도 아이디 생성
      name: spot.title,
      contenttypeid: Number(spot.contenttypeid),
      lat: parseFloat(spot.y),
      lng: parseFloat(spot.x)
    }))
  };

  try {
    console.log('✅ 보낼 payload:', payload);

    const response = await fetch('http://121.78.128.95:8000/api/generate-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('서버 응답 오류');
    }

    const result = await response.json();
    console.log('✅ 생성된 일정:', result);

    navigate('/result', { 
      state: { 
        schedule: result.schedule , 
        title: planTitle, 
        spots,
        departure: payload.departure,
        transport: payload.transport,
        persons: payload.persons
       } }); // spot 도 함께 넘겨 줘야 xy 좌표가 넘어감 
  } catch (err) {
    console.error(err);
    alert('일정 생성 실패');
  } finally {
    setIsSubmitting(false);
    }
};


  return (
    <>
      {/* ================= 로딩 오버레이 ================= */}
      {isSubmitting && (
        <div className="spinner-overlay">
          {/* 원형 스피너 표시 */}
          <div className="spinner" />
        </div>
      )}

      <section className="form-container">

        {/* --- 여행 제목 입력 필드 --- */}
        <div className="field mb-2">
          <label className="field-label">여행 제목</label>
          <input
            type="text"
            placeholder="여행 제목을 입력하세요."
            value={planTitle}
            onChange={e => setPlanTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded text-center"
          />
        </div>
        {/* 상단 3개 필드 */}
        <div className="grid-1">
          {/* 일정 선택 */}
          <div className="field">
            <label className="field-label">일정</label>
            <button type="button" className="date-range-box" onClick={() => setShowCalendar(true)}>
              <div className="date-text">
                {dateRange ? `${dateRange.start} ~ ${dateRange.end}` : '--.--.-- ~ --.--.--'}
              </div>
              <img src="/calendar.png" alt="calendar" />
            </button>
          </div>

          {/* 출발지 입력 */}
          <div className="field">
            <label className="field-label">출발지</label>
            <button type="button" className="date-range-box" onClick={() => setIsAddressOpen(true)}>
              <div className="date-text">{departure || '--'}</div>
              <img src="/map.png" alt="map" className="w-7 h-7" />
            </button>
            {isAddressOpen && (
              <div className="address-modal">
              {/* 닫기 버튼 추가 */}
              <button className="address-close-btn" onClick={() => setIsAddressOpen(false)}>✕</button>
                <DaumPostcode
                  onComplete={(data) => {
                    const fullAddress = data.roadAddress || data.jibunAddress;
                    setDeparture(fullAddress);
                    setIsAddressOpen(false);
                  }}
                  autoClose
                  style={{
                    width: '500px',
                    height: '450px'
                  }}
                />
              </div>
            )}
          </div>
        </div>


        <div className="grid-2">
          <div className="field">
            <label className="field-label">이동수단</label>
            <IconSelect
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              options={TRANSPORT_OPTIONS}
            />
          </div>

          <div className="field">
            <label className="field-label">인원 수</label>
            <IconSelect
              value={persons}
              onChange={(e) => setPersons(e.target.value)}
              options={PERSON_COUNT_OPTIONS}
              unit="명"
            />
          </div>
        </div>

        <div className="nav-btns">
          {/* <button className="nav-btn prev" onClick={() => navigate(-1)}>이전</button>
          <button className="nav-btn next" onClick={handleSubmit}>일정 생성하기</button> */}
          <button className="nav-btn prev" onClick={() => navigate(-1)} disabled={isSubmitting}>이전</button>
          <button className={`nav-btn next ${isSubmitting ? 'loading' : ''}`} onClick={handleSubmit} disabled={isSubmitting}>
          {/* 버튼 텍스트를 로딩 여부에 따라 변경 */}
          {isSubmitting ? '일정 생성중…' : '일정 생성하기'}
        </button>
        </div>
      </section>

      {/* 일정 선택 모달 */}
      {showCalendar && (
        <CalendarModal
          initialRange={dateRange}
          onClose={() => setShowCalendar(false)}
          onSelect={(r) => {
            setDateRange(r);
            setShowCalendar(false);
          }}
        />
      )}

      {/* ✅ 여기에 생성된 일정 표시 */}
      {generatedSchedule && (
        <section className="generated-schedule">
          <h2>✅ 생성된 일정</h2>
          {generatedSchedule.days && generatedSchedule.days.map((day, index) => (
            <div key={index} className="day-box">
              <h3>📅 {day.date}</h3>
              <ul>
                {day.schedule.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.time}</strong> - {item.place}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </>
  );
};

export default TravelInfoForm;
