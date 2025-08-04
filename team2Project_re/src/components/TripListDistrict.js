import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import TripModal from './TripModal';
import './TripList.css';
import { useLoginContext } from '../contexts/LoginContext';

const API_HOST = 'http://121.78.128.95:9093';
const { PUBLIC_URL } = process.env;
const defaultImage = `${PUBLIC_URL}/images/default.png`;

async function fetchJSON(endpoint) {
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function TripListDistrict() {
  const { regionNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useLoginContext();
  const user_no = loginUser?.user_no; // ✅ 이렇게 수정

  const [districts, setDistricts] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [rname, setRname] = useState(location.state?.rname || '해당 지역');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location.state?.rname) {
      fetchJSON(`${API_HOST}/region/read?region_no=${regionNo}`)
        .then(data => setRname(data?.rname || '해당 지역'))
        .catch(err => {
          console.error('지역 이름 조회 실패', err);
          setRname('해당 지역');
        });
    }
  }, [regionNo, location.state]);

  useEffect(() => {
    fetchJSON(`${API_HOST}/district/list?region_no=${regionNo}&sort=${sortBy}`)
      .then(data => Array.isArray(data) && setDistricts(data))
      .catch(console.error);
  }, [regionNo, sortBy]);

  const selectDistrict = useCallback(async (districtNo) => {
    setSelectedDistrict(districtNo);
    setLoading(true);

    try {
      const trip = await fetchJSON(
        `${API_HOST}/trip/read_by_district?district_no=${districtNo}&sort=${sortBy}`
      );

      if (!trip?.trip_no) {
        console.warn('선택된 여행지 없음', trip);
        return;
      }

      const regionCode = `${trip.trip_no}${trip.tname.toUpperCase()}`;
      const analysisRes = await fetch(
        `http://121.78.128.95:8000/trip/analysis?region_code=${regionCode}&region_name=${trip.tname}&trip_no=${trip.trip_no}`
      );
      const analysisData = await analysisRes.json();

      setActiveTrip({
        ...trip,
         district: trip.district ?? trip.sname,
        chart: analysisData.chart,
        insight: analysisData.insight,
        piechart: analysisData.piechart,
        top5: analysisData.top5
      });


    } catch (err) {
      console.error('여행지 및 분석 조회 실패', err);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  return (
    <div className="trip-container">
      <header className="trip-header">
        <h2>✈ {rname}로 떠나볼까요?</h2>
        <div className="trip-header-controls">
          <button className="back-button" onClick={() => navigate('/triplistregion')}>⬅ 시도로 돌아가기</button>
          <div className="select-box">
            <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">연간 방문자 순</option>
              <option value="views">조회수 높은 순</option>
            </select>
          </div>
        </div>
      </header>

      <div className="trip-grid">
        {districts.map(({ district_no, dimage, dname }) => (
          <div
            key={district_no}
            tabIndex={0}
            className={`trip-card ${district_no === selectedDistrict ? 'selected' : ''}`}
            onClick={() => selectDistrict(district_no)}
          >
            <img
              src={dimage ? `${PUBLIC_URL}/images_g/${dimage}` : defaultImage}
              alt={dname}
              className="trip-image"
            />
            <h3>{dname}</h3>
          </div>
        ))}
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>여행지 데이터를 불러오는 중입니다 ⏳</p>
        </div>
      )}

      {activeTrip && (
        <TripModal
          trip={activeTrip}
          onClose={() => setActiveTrip(null)}
          user_no={user_no}
        />

      )}
    </div>
  );
}
