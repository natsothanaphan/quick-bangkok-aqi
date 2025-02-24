const toRadians = (degrees) => (degrees * Math.PI) / 180;
const R = 6371; // Earth's radius in kilometers

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const a =
    Math.sin(toRadians(lat2 - lat1) / 2) ** 2
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2))
      * Math.sin(toRadians(lon2 - lon1) / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export { haversineDistance };
