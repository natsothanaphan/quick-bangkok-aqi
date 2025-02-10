const breakpoints = [
  { cLow: 0,     cHigh: 12,    iLow: 0,   iHigh: 50,  category: 'Good',                          color: 'green' },
  { cLow: 12.1,  cHigh: 35.4,  iLow: 51,  iHigh: 100, category: 'Moderate',                      color: 'yellow' },
  { cLow: 35.5,  cHigh: 55.4,  iLow: 101, iHigh: 150, category: 'Unhealthy for Sensitive Groups', color: 'orange' },
  { cLow: 55.5,  cHigh: 150.4, iLow: 151, iHigh: 200, category: 'Unhealthy',                     color: 'red' },
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300, category: 'Very Unhealthy',                color: 'purple' },
  { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400, category: 'Hazardous',                     color: 'brown' },
  { cLow: 350.5, cHigh: 500,   iLow: 401, iHigh: 500, category: 'Hazardous',                     color: 'brown' },
];
  
/**
 * Converts PM2.5 concentration to US AQI along with its category and color.
 * 
 * US AQI Breakpoints:
 * - Good (green)          - PM2.5 0-12,         AQI 0-50
 * - Moderate (yellow)     - PM2.5 12.1-35.4,    AQI 51-100
 * - Unhealthy for Sensitive Groups (orange) - PM2.5 35.5-55.4,    AQI 101-150
 * - Unhealthy (red)       - PM2.5 55.5-150.4,   AQI 151-200
 * - Very unhealthy (purple)- PM2.5 150.5-250.4,  AQI 201-300
 * - Hazardous (brown)     - PM2.5 250.5-350.4,  AQI 301-400
 * - Hazardous (brown)     - PM2.5 350.5-500,    AQI 401-500
 *
 * @param {number} pm25 - The PM2.5 concentration.
 * @returns {(object|null)} An object containing:
 *   - aqi: The computed AQI value (number).
 *   - category: A string label for the air quality category.
 *   - color: A string representing the color associated with the category.
 *
 * Returns null if the input is invalid or out of supported range.
 */
function pm25ToAQI(pm25) {
  if (typeof pm25 !== 'number' || isNaN(pm25) || pm25 < 0) {
    return null;
  }

  // Find the appropriate breakpoint interval for the given PM2.5 value.
  pm25 = Math.round(pm25 * 10) / 10;
  const bp = breakpoints.find(bp => pm25 >= bp.cLow && pm25 <= bp.cHigh);
  if (!bp) {
    // PM2.5 value is out of our defined ranges (e.g., above 500).
    return null;
  }

  // Calculate the AQI using linear interpolation.
  const aqi = Math.round(
    ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow
  );

  return { aqi, category: bp.category, color: bp.color };
}

export { pm25ToAQI };
