import React from 'react';
import StationCard from './StationCard';
import './StationList.css';

const StationList = ({ stations }) => {
  return (
    <div className="station-list">
      {stations.map((station, index) => (
        <StationCard key={index} station={station} />
      ))}
    </div>
  );
};

export default StationList;
