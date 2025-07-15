// 사용자가 여행 날짜 범위를 선택할 수 있는 커스텀 달력 모달
import React, { useState, useMemo } from 'react';     //  상태 관리와 memoization을 위한 훅
import {
  format,               //  날짜 포맷
  startOfMonth,         //  해당 월의 시작일 
  endOfMonth,           //  해달 월의 마지막일 
  eachDayOfInterval,    //  시작 ~ 끝 날짜 배열 생성
  addMonths,            //  월 단위 더하기
  getDay,               //  요일 반환(0: 일요일 ~ 6: 토요일)
  isSameDay,            //  두 날짜가 같은 날인지 비교
} from 'date-fns';
import { ko } from 'date-fns/locale';     //  한국어 로케일
import '../styles/calendarModal.css';     //  전용 CSS import

const weekdaysKo = ['일', '월', '화', '수', '목', '금', '토'];  //  요일 텍스트

const CalendarModal = ({ initialRange, onClose, onSelect }) => {
  //  날짜 범위 상태: start와 end
  const [range, setRange] = useState(
    initialRange
      ? { start: new Date(initialRange.start), end: new Date(initialRange.end) }
      : { start: null, end: null }
  );

  //   몇 개월 뒤를 보여줄지 offset(0: 이번 달, 1: 다음 달 ...)
  const [offset, setOffset] = useState(0);

  //  표시할 두 개의 월 계산(이번 달 + 다음 달) 
  const months = useMemo(
    () => [addMonths(new Date(), offset), addMonths(new Date(), offset + 1)],
    [offset]
  );

  //  주어진 월의 달력 날짜 배열 생성(앞 공백 포함)
  const buildGrid = (monthDate) => {
    const start = startOfMonth(monthDate);                            //  1일
    const end = endOfMonth(monthDate);                                //  마지막 날
    const prefix = Array.from({ length: getDay(start) }).fill(null);  //  시작 전 빈칸
    return [...prefix, ...eachDayOfInterval({ start, end })];         //  실제 날짜 포함
  };

  // 오늘 날짜
  const today = new Date();
  
  //  오늘인지 확인
  const isToday = (d) => d && isSameDay(d, today);

  // 요일 확인용 함수
  const isSat   = (d) => d && getDay(d) === 6;
  const isSun   = (d) => d && getDay(d) === 0;

  // 날짜가 선택된 범위에 포함되는지 판별
  const isSelected = (d) => {
    const { start, end } = range;
    if (!d || !start) return false;
    if (!end) return isSameDay(d, start);   //  아직 끝 날짜 미선택 시
    return start <= d && d <= end;
  };

  // 날짜 클릭 시 처리 로직
  const onDateClick = (day) => {
    if (!day) return;
    const { start, end } = range;
    if (!start || (start && end)) {
      // 초기 클릭 또는 다시 선택 시
      setRange({ start: day, end: null });
    } else {
      // 범위가 되도록 설정
      setRange(day < start ? { start: day, end: start } : { start, end: day });
    }
  };

  // "선택" 버튼 클릭 시 부모로 범위 전달
  const submit = () => {
    const { start, end } = range;
    if (start && end) {
      onSelect({
        start: format(start, 'yyyy-MM-dd'),
        end:   format(end,   'yyyy-MM-dd'),
      });
    }
  };

  /* ── render ── */
  return (
    <>
    {/* 오버레이 - 모달 닫기 */}
      <div className="overlay" onClick={onClose} />

      {/* 모달 본체 */}
      <div className="modal-box">
        {/* 닫기 버튼 */}
        <button className="close" onClick={onClose}>✕</button>

        {/* 타이틀 */}
        <h3 className="title">여행 일정</h3>
        <p className="desc">* 여행 기간(출발~도착)을 선택해 주세요.</p>

        {/* 월 전환 버튼 */}
        <div className="month-nav">
          <button onClick={() => setOffset((o) => o - 1)}>◀</button>
          <span />
          <button onClick={() => setOffset((o) => o + 1)}>▶</button>
        </div>

        {/* 달력 렌더링 */}
        <div className="calendar-wrapper">
          {months.map((m, idx) => (
            <div key={idx} className="month-box">
              {/* 월 표시(ex. 2025년 6월) */}
              <div className="month-title">
                {format(m, 'yyyy년 M월', { locale: ko })}
              </div>

              {/* 요일 헤더 */}
              <div className="weekdays">
                {weekdaysKo.map((w) => (
                  <span key={w} className={w === '토' ? 'sat' : w === '일' ? 'sun' : ''}>
                    {w}
                  </span>
                ))}
              </div>

              {/* 날짜 셀 렌더링 */}
              <div className="dates">
                {buildGrid(m).map((day, i) =>
                  day ? (
                    <div
                      key={i}
                      className={[
                        'date',                         //  기본 날짜 셀
                        isSat(day) && 'sat',            //  토요일 스타일
                        isSun(day) && 'sun',            //  일요일 스타일
                        isToday(day) && 'today',        //  오늘 강조
                        isSelected(day) && 'selected',  //  선택된 날짜
                      ]
                        .filter(Boolean)                //  falsy 제거
                        .join(' ')}                     //  클래스 병합
                      onClick={() => onDateClick(day)}  //  날짜 클릭 이벤트
                    >
                      {day.getDate()}                   {/* 숫자만 출력 */}
                    </div>
                  ) : (
                    <span key={i} className="blank" />  //  앞 공백용 칸
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 선택 버튼 */}
        <button className="modal-submit" onClick={submit}>선택</button>
      </div>
    </>
  );
};

export default CalendarModal;
