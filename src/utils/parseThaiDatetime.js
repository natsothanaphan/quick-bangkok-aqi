const thaiMonths = {
  "มกราคม": 0,
  "กุมภาพันธ์": 1,
  "มีนาคม": 2,
  "เมษายน": 3,
  "พฤษภาคม": 4,
  "มิถุนายน": 5,
  "กรกฎาคม": 6,
  "สิงหาคม": 7,
  "กันยายน": 8,
  "ตุลาคม": 9,
  "พฤศจิกายน": 10,
  "ธันวาคม": 11,
};

/**
 * Converts a Thai date/time string to a JavaScript Date object.
 * The input is expected to be in the format: "7 กุมภาพันธ์ 2025 20:00 น."
 *
 * @param {string} dateStr The date part (e.g., "7 กุมภาพันธ์ 2025")
 * @param {string} timeStr The time part (e.g., "20:00 น.")
 * @returns {Date} The parsed Date object.
 */
export function parseThaiDatetime(dateStr, timeStr) {
  // Remove the extraneous " น." if present and trim the result.
  const dateTimeStr = `${dateStr} ${timeStr}`.replace(" น.", "").trim();
  // Expected format: "7 กุมภาพันธ์ 2025 20:00"
  const parts = dateTimeStr.split(/\s+/);
  
  if (parts.length >= 4) {
    const [dayStr, monthThai, yearStr, timePart] = parts;
    const day = parseInt(dayStr, 10);
    const month = thaiMonths[monthThai];
    const year = parseInt(yearStr, 10);
    const [hour, minute] = timePart.split(":").map(num => parseInt(num, 10));
    return new Date(year, month, day, hour, minute);
  } else {
    return null;
  }
}
