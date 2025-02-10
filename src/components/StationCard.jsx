import React from "react";
import formatDatetime from "../utils/formatDatetime";
import "./StationCard.css"; // Import the stylesheet

function StationCard({ station }) {
  const {
    name_th,
    name_en,
    district_th,
    district_en,
    pm25,
    datetime,
    distance,
    aqiData, // Now received via props
  } = station;

  // Determine the CSS class for the border color based on AQI data.
  const aqiClass = aqiData ? `aqi-${aqiData.color}` : "aqi-gray";

  return (
    <div className={`station-card ${aqiClass}`}>
      <h3>{name_th}, {name_en}</h3>
      <p>
        {district_th}, {district_en}
      </p>
      {distance !== undefined && distance !== null && (
        <p>
          {distance.toFixed(3)} km
        </p>
      )}
      {pm25 !== undefined && pm25 !== null && (
        <p>
          <strong>PM2.5:</strong> {pm25}
        </p>
      )}
      {aqiData !== undefined && aqiData !== null && (
        <p>
          <strong>AQI:</strong> {aqiData.aqi}, {aqiData.category}
        </p>
      )}
      <p>
        {formatDatetime(datetime)}
      </p>
    </div>
  );
}

export default StationCard;
