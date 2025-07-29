import React, {useState, useRef} from 'react';
import RegionModal from './RegionModal';

const regionData = [
  {
    name: '서울특별시',
    displayName: '서울특별시',
    image: '/regions/seoul.png',
    style: 'top-[23.3%] left-[43%] w-[3%] z-50',
  },
  {
    name: '경기도',
    displayName: '경기도',
    image: '/regions/geongi.png',
    style: 'top-[13.4%] left-[39.3%] w-[12.5%] z-40',
  },
  {
    name: '인천광역시',
    displayName: '인천광역시',
    image: '/regions/incheon.png',
    style: 'top-[20.5%] left-[33%] w-[10%] z-50',
  },
  {
    name: '강원특별자치도',
    displayName: '강원특별자치도',
    image: '/regions/gangwon.png',
    style: 'top-[7.5%] left-[46.5%] w-[17%] z-30',
  },
  {
    name: '경상북도',
    displayName: '경상북도',
    image: '/regions/geongsangbukdo.png',
    style: 'top-[31.8%] left-[51.5%] w-[18%] z-40',
  },
  {
    name: '충청북도',
    displayName: '충청북도',
    image: '/regions/chungcheongbukdo.png',
    style: 'top-[31%] left-[47.3%] w-[11%] z-40',
  },
  {
    name: '충청남도',
    displayName: '충청남도',
    image: '/regions/chungcheongnamdo.png',
    style: 'top-[34.4%] left-[36.2%] w-[13.7%] z-40',
  },
  {
    name: '세종특별자치시',
    displayName: '세종특별자치시',
    image: '/regions/sejong.png',
    style: 'top-[40%] left-[45.5%] w-[2.5%] z-50',
  },
  {
    name: '대전광역시',
    displayName: '대전광역시',
    image: '/regions/daejeon.png',
    style: 'top-[44.8%] left-[46.9%] w-[2.3%] z-50',
  },
  {
    name: '전북특별자치도',
    displayName: '전북특별자치도',
    image: '/regions/jeollabookdo.png',
    style: 'top-[51%] left-[38.5%] w-[13.5%] z-40',
  },
  {
    name: '경상남도',
    displayName: '경상남도',
    image: '/regions/geongsangnamdo.png',
    style: 'top-[55.3%] left-[49.6%] w-[13.5%] z-40',
  },
  {
    name: '부산광역시',
    displayName: '부산광역시',
    image: '/regions/busan.png',
    style: 'top-[65.2%] left-[59.8%] w-[4.3%] z-40',
  },
  {
    name: '전라남도',
    displayName: '전라남도',
    image: '/regions/jeollanamdo.png',
    style: 'top-[62.7%] left-[29.2%] w-[23%] z-40',
  },
  {
    name: '광주광역시',
    displayName: '광주광역시',
    image: '/regions/gwangju.png',
    style: 'top-[66.8%] left-[41.8%] w-[3%] z-50',
  },
  {
    name: '대구광역시',
    displayName: '대구광역시',
    image: '/regions/daegu.png',
    style: 'top-[47.5%] left-[56.1%] w-[4.5%] z-50',
  },
  {
    name: '울산광역시',
    displayName: '울산광역시',
    image: '/regions/ulsan.png',
    style: 'top-[58.3%] left-[61%] w-[4.3%] z-50',
  },
  {
    name: '제주특별자치도',
    displayName: '제주도',
    image: '/regions/jeju.png',
    style: 'top-[85.8%] left-[39.7%] w-[8.5%] z-50',
  },
];

const Map = ({
  selectedRegion,
  setSelectedRegion,
  setSpotList,
  setCurrentAreaCode,
  setCurrentSigunguCode,
  fetchSpotList,
}) => {
  const [showGuide, setShowGuide] = useState(false);   // 팝업 상태
  const guideShownRef = useRef(false);                 // 한 페이지에서 딱 한 번 표시 여부

  /* ② 함수 안에서 guideShown 로직까지 처리 */
  const handleRegionClick = (regionName) => {
    setSelectedRegion(regionName);
    setSpotList([]);

    // 이번 페이지에서 아직 안 띄웠다면
    if (!guideShownRef.current) {
      setShowGuide(true);
      guideShownRef.current = true;   // 다시는 안 띄움 (새로고침 시 초기화)
    }
  };

  /* 배경 클릭 시 모달 닫기 */
  const handleOverlayClick = () => setSelectedRegion(null);

  /* ---------- JSX ---------- */
  return (
    <div className="relative w-full h-full">

      {/* 가이드 팝업 & 오버레이 */}
      {showGuide && (
        <>
          <div
            className="absolute inset-0 bg-black/60 z-[999]"
            onClick={() => setShowGuide(false)}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          bg-white rounded-lg shadow-xl p-6 pt-10 w-80 z-[1000]">
            <p className="text-gray-800 text-center text-xl mb-4">
              지역 이름을 클릭하세요!
            </p>
            <button
              onClick={() => setShowGuide(false)}
            className="absolute top-1 right-3 z-50 text-gray-300 text-2xl hover:text-gray-500"
          >
            ✕
            </button>
          </div>
        </>
      )}

      {/* 전국 지도 */}
      <img
        src="/korea_map_colored.png"
        alt="전국 지도"
        className="w-full h-full object-contain"
      />

      {/* 대지역 선택 레이어 */}
      {regionData.map((region) => (
        <img
          key={region.name}
          src={region.image}
          alt={region.name}
          className={`absolute ${region.style} opacity-0 cursor-pointer ${
            selectedRegion ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
          onClick={() => handleRegionClick(region.name)}
        />
      ))}

      {/* RegionModal 영역 */}
      {selectedRegion && (
        <>
          <div
            className="absolute inset-0 bg-black/70 z-40 rounded-xl"
            onClick={handleOverlayClick}
          />
          <div className="absolute top-3 left-5 z-50 text-white text-3xl font-semibold">
            {regionData.find((r) => r.name === selectedRegion)?.displayName || selectedRegion}
          </div>
          <button
            onClick={() => setSelectedRegion(null)}
            className="absolute top-2 right-4 z-50 text-white text-2xl hover:text-gray-300"
          >
            ✕
          </button>

          {/* 통영시 추가 텍스트 예시 */}
          {selectedRegion === '경상남도' && (
            <div className="absolute pointer-events-none z-[999]" style={{ top: '73%', left: '45.7%' }}>
              <span className="text-white text-md font-medium">통영시</span>
            </div>
          )}

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <RegionModal
              region={selectedRegion}
              image={regionData.find((r) => r.name === selectedRegion)?.image}
              onDistrictClick={(name, areaCode, sigunguCode) => {
                setCurrentAreaCode(areaCode);
                setCurrentSigunguCode(sigunguCode);
                fetchSpotList(areaCode, sigunguCode, null);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Map;