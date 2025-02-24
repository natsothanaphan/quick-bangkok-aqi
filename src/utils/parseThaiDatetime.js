const thaiMonths = {
  'มกราคม': 0,
  'กุมภาพันธ์': 1,
  'มีนาคม': 2,
  'เมษายน': 3,
  'พฤษภาคม': 4,
  'มิถุนายน': 5,
  'กรกฎาคม': 6,
  'สิงหาคม': 7,
  'กันยายน': 8,
  'ตุลาคม': 9,
  'พฤศจิกายน': 10,
  'ธันวาคม': 11,
};

// "7 กุมภาพันธ์ 2025", "20:00 น."
const parseThaiDatetime = (dateStr, timeStr) => {
  const parts = `${dateStr} ${timeStr}`.replace('น.', '').trim().split(/\s+/); 
  if (parts.length !== 4) return null;

  const [dayStr, monthThai, yearStr, timePart] = parts;
  const day = parseInt(dayStr, 10);
  const month = thaiMonths[monthThai];
  const year = parseInt(yearStr, 10);
  const [hour, minute] = timePart.split(':').map((num) => parseInt(num, 10));
  return new Date(year, month, day, hour, minute);
};

export { parseThaiDatetime };
