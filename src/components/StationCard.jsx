import React from 'react';
import './StationCard.css';
import { formatDatetime } from '../utils/formatDatetime.js';

const StationCard = ({ station }) => {
  const {
    name_th, name_en,
    district_th, district_en,
    pm25,
    datetime,
    distance,
    aqiData,
  } = station;

  const aqiClass = aqiData ? `aqi-${aqiData.color}` : 'aqi-gray';
  const distanceText = distance !== undefined && distance !== null ? `📍 ${distance.toFixed(3)} km` : '📍 N/A';
  const pm25Text = pm25 !== undefined && pm25 !== null ? `🧪 PM2.5 ${pm25}` : '🧪 N/A';
  const aqiText = aqiData !== undefined && aqiData !== null ? `🚨 AQI ${aqiData.aqi} (${aqiData.category})` : '🚨 N/A';
  const datetimeText = `📅 ${formatDatetime(datetime)}`;

  return (
    <div className={`station-card ${aqiClass}`}>
      <h2>{name_th}—{name_en}</h2>
      <p>{district_th}—{district_en}</p>
      <p>{distanceText}—{datetimeText}</p>
      <p>{pm25Text}—{aqiText}</p>
    </div>
  );
};

export default StationCard;
