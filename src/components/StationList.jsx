import React from "react";
import StationCard from "./StationCard";
import "./StationList.css"; // Import the CSS file

function StationList({ stations }) {
  if (!stations || stations.length === 0) {
    return <div>No station data available.</div>;
  }
  return (
    <div className="station-list">
      {stations.map((station, index) => (
        <StationCard key={index} station={station} />
      ))}
    </div>
  );
}

export default StationList;
