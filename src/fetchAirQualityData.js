import { parseThaiDatetime } from './utils/parseThaiDatetime';

/**
 * Fetches air quality data from the remote endpoint, parses the XML,
 * and returns an array of station objects with the following properties:
 * - name_th
 * - name_en
 * - district_th
 * - district_en
 * - lat (converted to float, or null if not available)
 * - lng (converted to float, or null if not available)
 * - pm25 (converted to float, or null if not available)
 * - datetime (a combination of date_time and time attributes)
 *
 * @returns {Promise<Array<Object>>} Promise resolving with an array of station objects.
 */
async function fetchAirQualityData() {
  try {
    const response = await fetch('/api/bma/marker.php');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const xmlString = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const markerElements = xmlDoc.getElementsByTagName("marker");

    const markers = [];
    for (let i = 0; i < markerElements.length; i++) {
      const marker = markerElements[i];

      const name_th     = marker.getAttribute('name_th') || '';
      const name_en     = marker.getAttribute('name_en') || '';
      const district_th = marker.getAttribute('district_th') || '';
      const district_en = marker.getAttribute('district_en') || '';
      const latAttr     = marker.getAttribute('lat');
      const lngAttr     = marker.getAttribute('lng');
      const pm25Attr    = marker.getAttribute('pm25');
      const date_time   = marker.getAttribute('date_time') || '';
      const time        = marker.getAttribute('time') || '';
      
      // Convert the Thai datetime string to a Date object.
      const datetime = parseThaiDatetime(date_time, time);

      // Convert lat/lng to floats if possible, otherwise null.
      let lat = latAttr && latAttr !== '-' ? parseFloat(latAttr) : null;
      let lng = lngAttr && lngAttr !== '-' ? parseFloat(lngAttr) : null;
      let pm25 = pm25Attr ? parseFloat(pm25Attr) : null;
      if (isNaN(lat)) {
        lat = null;
      }
      if (isNaN(lng)) {
        lng = null;
      }
      if (isNaN(pm25)) {
        pm25 = null;
      }

      if (lat !== null && lng !== null && lat > lng) {
        console.log('Data mistake, lat and lng are swapped', marker);
        const temp = lat;
        lat = lng;
        lng = temp;
      }

      markers.push({
        name_th,
        name_en,
        district_th,
        district_en,
        lat,
        lng,
        pm25,
        datetime,
      });
    }

    return markers;
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    throw error;
  }
}

export default fetchAirQualityData;
