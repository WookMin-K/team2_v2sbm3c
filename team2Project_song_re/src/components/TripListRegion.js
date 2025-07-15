import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TripList.css';
import TripModal from './TripModal';
import { useLoginContext } from '../contexts/LoginContext';



//const API_HOST = 'http://192.168.12.142:9093';
const API_HOST = 'http://localhost:9093';
const { PUBLIC_URL } = process.env;
const defaultRegionImage = `${PUBLIC_URL}/images/default.png`;
const defaultDistrictImage = `${PUBLIC_URL}/images/default_district.png`;

async function fetchJSON(endpoint) {
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function TripListRegion() {
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loginUser } = useLoginContext();

  const [activeTrip, setActiveTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetchJSON(`${API_HOST}/region/list`),
      fetchJSON(`${API_HOST}/district/all`)
    ])
      .then(([regionData, districtData]) => {
        if (Array.isArray(regionData)) setRegions(regionData);
        if (Array.isArray(districtData)) setDistricts(districtData);
      })
      .catch(err => {
        console.error(err);
        setError('지역 정보를 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredDistricts = districts.filter(d => {
    const region = regions.find(r => r.region_no === d.region_no);
    const rname = region?.rname || '';
    return (
      d.dname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // 구군 클릭 시 상세 trip 데이터 받아 모달 열기
  const handleDistrictClick = async (district_no) => {
    setLoading(true); // 🔹 시작
    try {
      const resTrips = await fetch(`${API_HOST}/trip/read_list_by_district?district_no=${district_no}`);
      const tripList = await resTrips.json();

      if (tripList.length === 0) {
        alert('해당 구군에 등록된 여행지가 없습니다.');
        return;
      }

      const firstTripNo = tripList[0].trip_no;
      const resTrip = await fetch(`${API_HOST}/trip/read?trip_no=${firstTripNo}`);
      const trip = await resTrip.json();

      const regionCode = `${trip.trip_no}${trip.tname.toUpperCase()}`;
      const analysisRes = await fetch(
        `http://localhost:8000/trip/analysis?region_code=${regionCode}&region_name=${trip.tname}&trip_no=${trip.trip_no}`
      );
      const analysisData = await analysisRes.json();

      setActiveTrip({
        ...trip,
        chart: analysisData.chart,
        insight: analysisData.insight,
        piechart: analysisData.piechart,
        top5: analysisData.top5
      });
      setShowModal(true);
    } catch (err) {
      console.error('상세 여행지 및 분석 데이터 조회 실패:', err);
      alert('상세 여행지 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false); 
    }
  };



  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
        <p>여행지 데이터를 불러오는 중입니다 ⏳</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="trip-container">
      <header className="trip-header">
        <h2>✈️ 당신의 다음 여행, Travel AI와 함께 찾아볼까요?</h2>
        <input
          type="text"
          placeholder="시도 또는 구군 이름으로 검색 (예: 제주, 강남)"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </header>

      <div className="trip-grid">
        {searchTerm ? (
          filteredDistricts.map(({ district_no, dname, region_no, dimage }) => {
            const region = regions.find(r => r.region_no === region_no);
            const rname = region?.rname || '시도 없음';

            return (
              <div
                key={district_no}
                className="trip-card"
                tabIndex={0}
                onClick={() => handleDistrictClick(district_no)}
              >
                <img
                  src={dimage ? `${PUBLIC_URL}/images_g/${dimage}` : defaultDistrictImage}
                  alt={dname}
                  className="trip-image"
                />
                <h3>{dname}</h3>
                <p className="region-name">({rname})</p>
              </div>
            );
          })
        ) : (
          regions.map(({ region_no, rimage, rname }) => (
            <div
              key={region_no}
              className="trip-card"
              tabIndex={0}
              onClick={() => navigate(`/district/${region_no}`, { state: { rname } })}
            >
              <img
                src={rimage ? `${PUBLIC_URL}/images_g/${rimage}` : defaultRegionImage}
                alt={rname}
                className="trip-image"
              />
              <h3>{rname}</h3>
            </div>
          ))
        )}
      </div>

      {/* TripModal 출력 */}
      {showModal && activeTrip && (
        <TripModal
          trip={activeTrip}
          onClose={() => setShowModal(false)}
          user_no={loginUser?.user_no} 
        />
      )}
    </div>
  );
}
