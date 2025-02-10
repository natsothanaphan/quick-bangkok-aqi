const toRadians = (degrees) => (degrees * Math.PI) / 180;

const R = 6371; // Earth's radius in kilometers

/**
 * Calculates the distance between two geographic points using the Haversine formula.
 *
 * @param {number} lat1 - Latitude of the first location in degrees.
 * @param {number} lon1 - Longitude of the first location in degrees.
 * @param {number} lat2 - Latitude of the second location in degrees.
 * @param {number} lon2 - Longitude of the second location in degrees.
 *
 * @returns {number} - The distance between the two points in kilometers.
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);
  
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(radLat1) * Math.cos(radLat2) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

export { haversineDistance };
