import React, { useState, useEffect, useMemo } from "react";
import './App.css'
import fetchAirQualityData from './fetchAirQualityData'
import { haversineDistance } from './utils/distance'
import StationList from "./components/StationList";
import StationCard from "./components/StationCard";
import { pm25ToAQI } from "./utils/airQuality";

// Default location is the center of Bangkok
const DEFAULT_LOCATION = {lat: 13.736717, lon: 100.523186};

function App() {
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [locationInput, setLocationInput] = useState("");
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Validate the input (expects "lat, lon") and update userLocation if valid
  function validateAndSetLocation(value) {
    const trimmed = value.trim();

    // If the input is empty, revert to the default location.
    if (trimmed === "") {
      setError("");
      setUserLocation(DEFAULT_LOCATION);
      return;
    }

    const parts = trimmed.split(",");
    if (parts.length !== 2) {
      setError("Please enter coordinates in the format 'lat, lon'");
      setUserLocation(null);
      return;
    }

    const lat = parseFloat(parts[0].trim());
    const lon = parseFloat(parts[1].trim());
    if (isNaN(lat) || isNaN(lon)) {
      setError("Invalid coordinates; please enter numeric values");
      setUserLocation(null);
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError("Coordinates out of range. Latitude must be between -90 and 90 and longitude between -180 and 180");
      setUserLocation(null);
      return;
    }

    // Everything is valid - reformat the input with fixed six decimals.
    const formattedLocation = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    setLocationInput(formattedLocation);
    setError("");
    setUserLocation({ lat: parseFloat(lat.toFixed(6)), lon: parseFloat(lon.toFixed(6)) });
  }

  // Attempt to prefill the location input using geolocation if available
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const formatted = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setLocationInput(formatted);
          setUserLocation({ lat: latitude, lon: longitude });
        },
        (err) => {
          console.warn("Geolocation failed, please enter location manually.");
        }
      );
    }
  }, []);

  // Fetch station data only once and memoize it in state
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchAirQualityData();
        setRawData(data);
      } catch (err) {
        setError("Failed to fetch air quality data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Process and memoize stations data based on rawData and userLocation
  const processedStations = useMemo(() => {
    if (!rawData) return [];
    // Map over all stations to add aqiData and, if available, compute the distance
    const stations = rawData.map((station) => {
      const computedAQIData = pm25ToAQI(station.pm25);
      let computedDistance = null;
      // It's lng in the API response, not lon
      if (userLocation && station.lat != null && station.lng != null) {
        computedDistance = haversineDistance(
          userLocation.lat,
          userLocation.lon,
          station.lat,
          station.lng
        );
      }
      return { ...station, aqiData: computedAQIData, distance: computedDistance };
    });

    // If userLocation is available, sort by distance (closest first)
    if (userLocation) {
      stations.sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    return stations;
  }, [rawData, userLocation]);

  return (
    <div className="container">
      {/* Input field for manual location entry */}
      <div className="location-input">
        <label htmlFor="location">Enter your location (lat, lon): </label>
        <input
          id="location"
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onBlur={(e) => validateAndSetLocation(e.target.value)}
          placeholder="lat, lon"
        />
      </div>

      {loading && <div className="loading-error">Loading...</div>}
      {error && <div className="loading-error">Error: {error}</div>}

      {!loading && !error && (
        <>
          {processedStations.length > 0 && (
            <div>
              <h2>Nearest station</h2>
              <StationCard station={processedStations[0]} />
            </div>
          )}
          <h2>Other stations</h2>
          <StationList stations={processedStations.slice(1)} />
        </>
      )}
    </div>
  );
}

export default App;
