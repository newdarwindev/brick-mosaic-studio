/** @param {number} value @param {number} delta */
export function changeCount(value, delta) {
  return Math.max(0, Math.min(99, value + delta));
}
