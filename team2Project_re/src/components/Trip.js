// src/api/trip.js
import axios from 'axios';


export const fetchTripList = () => axios.get(`${BASE_URL}/list_all`);
export const fetchTripDetail = (tripNo) => axios.get(`${BASE_URL}/${tripNo}`);
