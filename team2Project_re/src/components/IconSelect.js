// 일반 텍스트 옵션 드롭다운을 커스텀 UI로 구성한 아이콘 스타일 셀렉트 박스

import React, { useState } from 'react';
import classNames from 'classnames';             // 조건부 클래스 부여 유틸리티
import '../styles/locationSelect.css';           // 공통 스타일 (placeholder-center, arrow-btn 등) import

const IconSelect = ({
  value = '',                  // 선택된 값 (기본값은 빈 문자열)
  onChange,                    // 변경 이벤트 콜백 (부모에서 받아옴)
  options = [],                // 선택 가능한 옵션 배열
  placeholder = '--',          // 값이 없을 때 표시할 플레이스홀더
  unit = '',                   // 옵션에 붙는 단위 (예: '명', '개')
}) => {
  const [open, setOpen] = useState(false);            // 드롭다운 열림 상태

  // 표시할 텍스트 구성 (선택 값 + 단위 or placeholder)
  const label = value !== '' ? `${value}${unit}` : placeholder;
  const isPlaceholder = value === '';                 // placeholder인지 여부

  const toggleOpen = () => setOpen((prev) => !prev);  // 열기/닫기 토글

  return (
    <div className="relative w-full">
      {/* 표시 영역 */}
      <div className="input-box w-full relative">
        {/* 텍스트: 항상 가운데 절대 배치 */}
        <span
          className={classNames(
            'placeholder-center',                  // 텍스트를 중앙에 위치
            isPlaceholder ? 'text-gray-400' : ''   // placeholder면 회색 텍스트
          )}
        >
          {label}
        </span>

        {/* 화살표 버튼 */}
        <button type="button" className="arrow-btn" onClick={toggleOpen}>
          <img src="/down-arrow.png" alt="arrow" />
        </button>
      </div>

      {/* 옵션 리스트 (열려 있을 때만 표시) */}
      {open && (
        <div className="dropdown">
          {(Array.isArray(options) ? options : []).map((opt) => (
            <div
              key={opt}
              className={classNames('option', {
                selected: value === opt,             // 선택된 항목 강조
              })}
              onClick={() => {
                // onChange를 input 이벤트처럼 흉내 내서 전달
                onChange({ target: { value: opt } });
                setOpen(false); // 선택 후 닫기
              }}
            >
              {`${opt}${unit}`}   {/*항목 텍스트 + 단위 출력*/}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconSelect;
