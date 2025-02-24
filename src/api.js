import { parseThaiDatetime } from './utils/parseThaiDatetime.js';

const fetchAirQualityData = async () => {
  try {
    const resp = await fetch('/api/airQualityData');
    if (!resp.ok) throw new Error('Network response was not ok');

    const xmlString = await resp.text();
    const xmlDoc = new DOMParser().parseFromString(xmlString, 'application/xml');

    return [...xmlDoc.getElementsByTagName('marker')].map((marker) => {
      const name_th     = marker.getAttribute('name_th') || '';
      const name_en     = marker.getAttribute('name_en') || '';
      const district_th = marker.getAttribute('district_th') || '';
      const district_en = marker.getAttribute('district_en') || '';
      const latAttr     = marker.getAttribute('lat');
      const lngAttr     = marker.getAttribute('lng');
      const pm25Attr    = marker.getAttribute('pm25');
      const date_time   = marker.getAttribute('date_time') || '';
      const time        = marker.getAttribute('time') || '';
      
      const datetime = parseThaiDatetime(date_time, time);
      let lat = latAttr ? parseFloat(latAttr) : null;
      let lng = lngAttr ? parseFloat(lngAttr) : null;
      let pm25 = pm25Attr ? parseFloat(pm25Attr) : null;
      if (isNaN(lat)) lat = null;
      if (isNaN(lng)) lng = null;
      if (isNaN(pm25)) pm25 = null;
      if (lat !== null && lng !== null && lat > lng) {
        console.log('Data mistake, lat and lng are swapped', marker);
        [lat, lng] = [lng, lat];
      }

      return {
        name_th, name_en,
        district_th, district_en,
        lat, lng, pm25, datetime,
      };
    });
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    throw error;
  }
}

export default{ fetchAirQualityData };
