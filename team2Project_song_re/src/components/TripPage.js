import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TripModal from './TripModal';

function TripPage() {
  const { trip_no } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const trip = state?.trip; // 또는 서버에서 trip_no로 fetch해도 됨

  const closeModal = () => navigate(-1);

  if (!trip) return <p>여행지 정보를 불러올 수 없습니다.</p>;

  return <TripModal trip={trip} onClose={closeModal} />;
}

export default TripPage;