// 도시 -> 구/군으로 단계별 지역을 선택하는 드롭다운 UI

import React, { useState } from 'react';
import { CITY_OPTIONS, LOCATION_TREE } from '../constants/locationOptions';   //  지역 데이터 import
import classNames from 'classnames';                                          //  조건부 클래스 적용 유틸  
import '../styles/locationSelect.css';                                        //  전용 스타일 import

const LocationSelect = ({ value, onChange }) => {
  const [step, setStep] = useState('city');          // 현재 선택 단계: 'city' -> 'district'
  const [open, setOpen] = useState(false);           // 드롭다운 열림 여부

  // 도시 선택 시: 도시 설정 후 구/군 선택 단계로 전환
  const selectCity = (city) => {
    onChange({ city, district: '' });   //  district는 초기화
    setStep('district');
  };

  // 구/군 선택 시: 값 설정 + 드롭다운 닫기
  const selectDistrict = (gu) => {
    onChange({ ...value, district: gu });   //  기존 city 유지
    setOpen(false);
  };

  // 표시할 텍스트 구성
  const label =
    value.city && value.district 
    ? `${value.city} ${value.district}`               // 도시 + 구 표시
    : value.city || '--';                             //  도시만 선택됐을 경우 또는 아무것도 없을 경우 '--'

  const isPlaceholder = label === '--';               //  placeholder 여부

  // 토글(열기/닫기)
  const toggleOpen = () => {
    if(!open) {
      setStep('city');
      setOpen(true);
    } else {
      setOpen(false);
    }
  };


  return (
    <div className="relative w-full">
      {/* 선택 박스 */}
      <div className="input-box w-full relative">
        {/* 가운데 정렬된 텍스트(값 또는 placeholder) */}
        <span
          className={classNames(
            'placeholder-center',                   //  텍스트 정렬 클래스
            isPlaceholder ? 'text-gray-400' : ''    //  값 없을 떄 회색 표시
          )}
        >
          {label}
        </span>

        {/* 화살표 버튼 */}
        <button type="button" className="arrow-btn" onClick={toggleOpen}>
          <img src="/down-arrow.png" alt="arrow" />
        </button>
      </div>

      {open && (
        <div className="dropdown">
          {/* 도시 선택 단계 */}
          {step === 'city' &&
            CITY_OPTIONS.map((city) => (
              <div
                key={city}
                className={classNames('option', {
                   selected: city === value.city   /* 선택된 도시 강조 */
                })}
                onClick={() => selectCity(city)}
              >
                {city}
              </div>
            ))}

          {/* 구/군 선택 단계 */}
          {step === 'district' &&
            LOCATION_TREE[value.city]?.map((gu) => (
              <div
                key={gu}
                className={classNames('option', {
                   selected: gu === value.district  /* 선택된 구 강조 */
                  })}
                onClick={() => selectDistrict(gu)}
              >
                {gu}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default LocationSelect;
