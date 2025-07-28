
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../styles/resultPage.css";
import { useLoginContext } from '../contexts/LoginContext';
export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { schedule, spots = [], departure, transport, persons, title  } = location.state ?? {};
  const { loginUser } = useLoginContext();
  console.log('✅ location.state:', location.state);
  console.log('✅ schedule:', schedule);
  console.log('✅ spots:', spots);

const handleSave = async () => {
  try {
    if (!schedule || !schedule.days) {
      alert('저장할 일정이 없습니다.');
      return;
    }

    // ✅ 로그인 사용자 번호 가져오기
    const user_no = loginUser?.user_no;
    if (!user_no) {
      alert('❗ 로그인 정보가 없습니다.');
      return;
    }

    // ✅ PlanVO 리스트로 변환
    const planList = [];
    schedule.days.forEach((day, dayIndex) => {
      day.schedule.forEach((item) => {
        const matchedSpot = spots.find(s => s.title === item.place);

        planList.push({
          title,                            // ← 나중에 동적 title 변환
          start_date: `${day.date} ${item.time}:00`, // ← “YYYY-MM-DD HH:mm:00” 형태
          departure,                // TravelInfoForm 에서 넘긴 값
          transport,                // TravelInfoForm 에서 넘긴 값
          people_count: String(persons), // TravelInfoForm 에서 넘긴 값
          place: item.place,
          contentstype: matchedSpot ? Number(matchedSpot.contenttypeid) : 12,
          x: matchedSpot ? parseFloat(matchedSpot.x) : 0.0,
          y: matchedSpot ? parseFloat(matchedSpot.y) : 0.0,
          trip_day: dayIndex + 1,
          user_no: user_no
        });
      });
    });

    console.log('✅ 보낼 planList:', planList);

    // ✅ POST 요청
    const res = await fetch('http://192.168.12.142:9093/travel/createList', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planList)
    });

    if (res.ok) {
      alert('✅ 일정이 DB에 저장되었습니다!');
      navigate('/');  
    } else {
      alert('❌ 저장 실패');
    }

  } catch (err) {
    console.error('❌ 저장 중 오류:', err);
    alert('❌ 저장 중 오류 발생');
  }
};
  // ✅ 잘못된 경우
  if (!schedule) {
    return (
      <div className="result-container">
        <h2>⚠️ 일정 정보가 없습니다.</h2>
        <button onClick={() => navigate('/travel-info')}>돌아가기</button>
      </div>
    );
  }

  if (!schedule.days || !Array.isArray(schedule.days)) {
    return (
      <div className="result-container">
        <h2>⚠️ 잘못된 일정 데이터 형식</h2>
        <pre>{JSON.stringify(schedule, null, 2)}</pre>
        <button onClick={() => navigate('/travel-info')}>돌아가기</button>
      </div>
    );
  }

  // ✅ 정상 화면
  return (
    <div className="result-container">
      <h1 className="result-title">✅ 생성된 일정</h1>

      <div className="days-wrapper">
        {schedule.days.map((day, dayIdx) => (
          <div key={dayIdx} className="day-card">
            <h2 className="day-date">📅 {day.date}</h2>
            <ul className="schedule-list">
              {day.schedule.map((item, itemIdx) => (
                <li key={itemIdx} className="schedule-item">
                  <span className="time">{item.time}</span>
                  <span className="place">{item.place}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="result-buttons">
        <button className="save-button" onClick={handleSave}>저장</button>
        <button className="back-button" onClick={() => navigate(-1)}>
          다시 만들기
        </button>
      </div>
    </div>
  );
}
