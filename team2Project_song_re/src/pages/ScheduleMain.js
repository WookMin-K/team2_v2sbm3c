import React, { useState } from 'react';
import Map from '../components/Map';
import RegionModal from '../components/RegionModal';
import { normalizeRegion, getSuggestions } from '../utils/regionNormalizer';
import { useNavigate } from 'react-router-dom';

const ScheduleMain = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const [spotList, setSpotList] = useState([]);
  const [selectedSpots, setSelectedSpots] = useState([]);

  const [currentAreaCode, setCurrentAreaCode] = useState(null);
  const [currentSigunguCode, setCurrentSigunguCode] = useState(null);

  const navigate = useNavigate();

  /** ✅ 일정 생성하기 → 선택한 장소만 TravelInfoForm으로 넘김 */
  const handleClickGenerate = () => {
    if (selectedSpots.length === 0) {
      alert('장소를 선택해주세요!');
      return;
    }

    console.log('✅ 선택한 장소:', selectedSpots);

    // 👉 이동수단/출발지/날짜/인원수는 여기서 안 넣음!
    navigate('/travel-info', { state: { selectedSpots } }); //////////////////////// 여기가 값들을 넘기는 부분 
  };

  /** ✅ 검색창 입력 */
  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchQuery(input);

    if (input.trim() === '') {
      setSuggestions([]);
    } else {
      setSuggestions(getSuggestions(input));
    }
  };

  /** ✅ 검색 실행 */
  const handleSearch = () => {
    const normalized = normalizeRegion(searchQuery);
    if (normalized) {
      setSelectedRegion(normalized);
      setSearchQuery('');
      setSuggestions([]);
      setSpotList([]);
      setSelectedSpots([]);
      setCurrentAreaCode(null);
      setCurrentSigunguCode(null);
    } else {
      alert('존재하지 않는 지역입니다.');
    }
  };

  /** ✅ 관광지 추가 */
  const handleAddSpot = (spot) => {
    if (!selectedSpots.find((s) => s.title === spot.title)) {
      setSelectedSpots([...selectedSpots, spot]);
    }
  };

  /** ✅ 관광지 제거 */
  const handleRemoveSpot = (title) => {
    setSelectedSpots(selectedSpots.filter((s) => s.title !== title));
  };

  /** ✅ 관광지 API 호출 */
  const fetchSpotList = async (areaCode, sigunguCode, contentTypeId = null) => {
    if (!areaCode || !sigunguCode) {
      alert('먼저 지역을 선택해 주세요.');
      return;
    }

    let url = `https://apis.data.go.kr/B551011/KorService2/areaBasedList2?serviceKey=e4jq57SH2aySDfvHoziWfjHv9UmgvHp%2FK4rnKBzVMJ%2BqifvUbL6TuOLriupMxI2B0FKprFnHonZ4Y6S45l2XrQ%3D%3D&numOfRows=50&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&arrange=C&areaCode=${areaCode}&sigunguCode=${sigunguCode}`; // 네 키 & 파라미터 유지
    if (contentTypeId) url += `&contentTypeId=${contentTypeId}`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      const items = json?.response?.body?.items?.item || [];

      const spotData = items.map(item => ({
        title: item.title,
        x: item.mapx,
        y: item.mapy,
        addr1: item.addr1,
        contenttypeid: item.contenttypeid
      }));

      setSpotList(spotData);
    } catch (err) {
      console.error("관광지 호출 실패:", err);
    }
  };

  /** ✅ 구 클릭 시 */
  const handleDistrictClick = (districtName, areaCode, sigunguCode) => {
    setCurrentAreaCode(areaCode);
    setCurrentSigunguCode(sigunguCode);
    fetchSpotList(areaCode, sigunguCode, null);
  };

  return (
    <div className="w-screen h-screen bg-[#f7f7f7] flex justify-center items-center p-4">
      <div className="shadow-xl flex w-full max-w-[1800px] bg-white h-[90vh]">

        {/* 왼쪽 - 장소 선택 */}
        <div className="w-[30%] p-6">
          <div className="bg-white rounded-xl shadow-md border p-6 h-full overflow-y-auto">
            <img
              src="/logo.png"
              alt="logo"
              className="h-6 cursor-pointer mb-6"
              onClick={() => navigate('/')}
            />

            {/* 검색 */}
            <div className="relative w-full max-w-sm mx-auto mb-4">
              <div className="bg-white rounded-md shadow border p-2 pr-12 mb-3">
                <input
                  type="text"
                  placeholder="여행지를 검색하세요."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-2 text-sm border rounded focus:outline-none"
                />
              </div>
              <button
                type="submit"
                onClick={handleSearch}
                className="absolute right-2 top-[14px] p-1"
              >
                <img src="/search_icon.png" alt="검색" className="w-5 h-5" />
              </button>
            </div>

            {/* 카테고리 필터 버튼 */}
            <div className="flex gap-2 flex-wrap mt-2">
              <button onClick={() => fetchSpotList(currentAreaCode, currentSigunguCode, null)} className="px-3 py-1 text-sm rounded border">전체</button>
              <button onClick={() => fetchSpotList(currentAreaCode, currentSigunguCode, 12)} className="px-3 py-1 text-sm rounded border">관광지</button>
              <button onClick={() => fetchSpotList(currentAreaCode, currentSigunguCode, 39)} className="px-3 py-1 text-sm rounded border">맛집</button>
              <button onClick={() => fetchSpotList(currentAreaCode, currentSigunguCode, 32)} className="px-3 py-1 text-sm rounded border">숙박</button>
            </div>

            {/* 관광지 목록 */}
            {spotList.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">관광지 목록</h3>
                {spotList.map((spot, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddSpot(spot)}
                    className="w-full text-left px-4 py-2 mb-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                  >
                    {spot.title}
                  </button>
                ))}
              </div>
            )}

            {/* 선택한 장소 */}
            {selectedSpots.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">선택한 장소</h3>
                {selectedSpots.map((spot, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRemoveSpot(spot.title)}
                    className="w-full text-left px-4 py-2 mb-2 bg-blue-100 rounded hover:bg-blue-200 text-sm"
                  >
                    {spot.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽 - 지도 & 버튼 */}
        <div className="relative w-full h-full p-6 rounded-xl overflow-hidden">
          <div className="relative bg-[#C1D1EA] rounded-xl shadow-xl border w-full h-full flex justify-center items-center">
            <Map
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              setSpotList={setSpotList}
              setCurrentAreaCode={setCurrentAreaCode}
              setCurrentSigunguCode={setCurrentSigunguCode}
              handleDistrictClick={handleDistrictClick}
              fetchSpotList={fetchSpotList}
            />
          </div>
          <button
            onClick={handleClickGenerate}
            className="absolute bottom-10 left-10 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 z-[9999]"
          >
            일정 생성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMain;