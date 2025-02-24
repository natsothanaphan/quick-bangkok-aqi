const breakpoints = [
  { cLow: 0,     cHigh: 12,    iLow: 0,   iHigh: 50,  category: 'Good',                          color: 'green' },
  { cLow: 12.1,  cHigh: 35.4,  iLow: 51,  iHigh: 100, category: 'Moderate',                      color: 'yellow' },
  { cLow: 35.5,  cHigh: 55.4,  iLow: 101, iHigh: 150, category: 'Unhealthy for Sensitive Groups', color: 'orange' },
  { cLow: 55.5,  cHigh: 150.4, iLow: 151, iHigh: 200, category: 'Unhealthy',                     color: 'red' },
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300, category: 'Very Unhealthy',                color: 'purple' },
  { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400, category: 'Hazardous',                     color: 'brown' },
  { cLow: 350.5, cHigh: 500,   iLow: 401, iHigh: 500, category: 'Hazardous',                     color: 'brown' },
];

const pm25ToAQI = (pm25) => {
  if (typeof pm25 !== 'number' || isNaN(pm25) || pm25 < 0) return null;
  pm25 = Math.round(pm25 * 10) / 10;
  const bp = breakpoints.find((bp) => pm25 >= bp.cLow && pm25 <= bp.cHigh);
  if (!bp) return null;

  const aqi = Math.round(
    ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow
  );

  return { aqi, category: bp.category, color: bp.color };
};

export { pm25ToAQI };
