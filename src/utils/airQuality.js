const hexToRgb = (hex) => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
};
const rgbToHex = ({ r, g, b }) => ('#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase());

const interpolateColor = (start, end, factor) => ({
  r: Math.round(start.r + factor * (end.r - start.r)),
  g: Math.round(start.g + factor * (end.g - start.g)),
  b: Math.round(start.b + factor * (end.b - start.b)),
});

const breakpoints = [
  { cLow: 0,     cHigh: 12,    iLow: 0,   iHigh: 50,  category: 'Good', color: '#008000' }, // green
  { cLow: 12.1,  cHigh: 35.4,  iLow: 51,  iHigh: 100, category: 'Moderate', color: '#FFFF00' }, // yellow
  { cLow: 35.5,  cHigh: 55.4,  iLow: 101, iHigh: 150, category: 'Unhealthy for Sensitive Groups', color: '#FFA500' }, // orange
  { cLow: 55.5,  cHigh: 150.4, iLow: 151, iHigh: 200, category: 'Unhealthy', color: '#FF0000' }, // red
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300, category: 'Very Unhealthy', color: '#800080' }, // purple
  { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400, category: 'Hazardous', color: '#A52A2A' }, // brown
  { cLow: 350.5, cHigh: 500,   iLow: 401, iHigh: 500, category: 'Severe', color: '#A52A2A' }, // brown
];
for (const bp of breakpoints) { bp.rgb = hexToRgb(bp.color); }

const pm25ToAQI = (pm25) => {
  if (typeof pm25 !== 'number' || isNaN(pm25) || pm25 < 0) return null;
  pm25 = Math.round(pm25 * 10) / 10;
  const i = breakpoints.findIndex((bp) => pm25 >= bp.cLow && pm25 <= bp.cHigh);
  if (i === -1) return null;
  const bp = breakpoints[i];
  const aqi = Math.round(((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow);
  let color;
  if (i === breakpoints.length - 1) color = bp.color;
  else {
    const bpNext = breakpoints[i + 1];
    color = rgbToHex(interpolateColor(bp.rgb, bpNext.rgb, (pm25 - bp.cLow) / (bpNext.cLow - bp.cLow)));
  }
  return { aqi, category: bp.category, color };
};

export { pm25ToAQI };
