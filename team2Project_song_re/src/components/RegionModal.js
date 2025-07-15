import React from 'react';
import { districts } from '../utils/districts';

const RegionModal = ({ region, image, onDistrictClick }) => {
  const regionDistricts = districts[region] || [];

  // 마커 클릭 시 부모에게 지역코드 전달
  const handleMarkerClick = (district) => {
    onDistrictClick(district.name, district.areaCode, district.sigunguCode);
  };

  return (
    <div className="relative">
      {/* 이미지 */}
      <img
        src={image}
        alt={`${region} 상세 지도`}
        className="max-w-[80vw] max-h-[80vh] object-contain rounded-xl"
      />

      {/* 구군 마커들 */}
      {regionDistricts.map((d) => (
        <img
          key={d.name}
          src="/marker/red-dot.png"
          alt={d.name}
          title={d.name}
          className="absolute cursor-pointer hover:scale-125 transition-transform opacity-0"
          style={{
            top: d.top,
            left: d.left,
            width: '28px',
            height: '28px',
            transform: 'translate(-50%, -50%)',
          }}
          onClick={() => handleMarkerClick(d)}
        />
      ))}
    </div>
  );
};

export default RegionModal;


