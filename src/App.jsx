import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import StationList from './components/StationList';
import StationCard from './components/StationCard';
import api from './api.js';
import { haversineDistance } from './utils/distance.js';
import { pm25ToAQI } from './utils/airQuality.js';

const DEFAULT_LOCATION = {lat: 13.736717, lon: 100.523186}; // center of Bangkok

const App = () => {
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [locationInput, setLocationInput] = useState('');
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateAndSetLocation = (value) => {
    const parts = value.split(',').map((v) => v.trim());
    if (parts.length !== 2) {
      setUserLocation(DEFAULT_LOCATION);
      setLocationInput('');
      return;
    }
    const [lat, lon] = parts.map(parseFloat);
    if (isNaN(lat) || isNaN(lon)) {
      setUserLocation(DEFAULT_LOCATION);
      setLocationInput('');
      return;
    }
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setUserLocation(DEFAULT_LOCATION);
      setLocationInput('');
      return;
    }

    setUserLocation({ lat: parseFloat(lat.toFixed(6)), lon: parseFloat(lon.toFixed(6)) });
    setLocationInput(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
  };

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: parseFloat(latitude.toFixed(6)), lon: parseFloat(longitude.toFixed(6)) });
          setLocationInput(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
      (err) => console.warn('Geolocation failed.'),
    );
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.fetchAirQualityData();
      setRawData(data);
    } catch (err) {
      alert('Failed to fetch air quality data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const processedStations = useMemo(() => {
    return (rawData || []).map((station) => {
      const computedAQIData = pm25ToAQI(station.pm25);
      let computedDistance = null;
      // It's lng in the API response, not lon
      if (station.lat != null && station.lng != null) {
        computedDistance = haversineDistance(
          userLocation.lat, userLocation.lon,
          station.lat, station.lng,
        );
      }
      return { ...station, aqiData: computedAQIData, distance: computedDistance };
    }).sort((a, b) => {
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
  }, [rawData, userLocation]);

  return (
    <div className="App">
      <div className="location-input">
        <label htmlFor=".location">Location (lat, lon)</label>
        <input id=".location" type="text" value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onBlur={(e) => validateAndSetLocation(e.target.value)} />
      </div>
      <div className="stations-info">
        {loading && <p>Loading...</p>}
        {!loading && <>
          {processedStations.length === 0 && <p>No station</p>}
          {processedStations.length > 0 && <div>
            <h1>Nearest</h1>
            <StationCard station={processedStations[0]} />
          </div>}
          {processedStations.length > 1 && <div>
            <h1>Others</h1>
            <StationList stations={processedStations.slice(1)} />
          </div>}
        </>}
      </div>
    </div>
  );
};

export default App;
