// src/api/trip.js
import axios from 'axios';

const BASE_URL = 'http://localhost:9093/Trip';
//const BASE_URL = 'http://192.168.12.142:9093/Trip';

export const fetchTripList = () => axios.get(`${BASE_URL}/list_all`);
export const fetchTripDetail = (tripNo) => axios.get(`${BASE_URL}/${tripNo}`);
