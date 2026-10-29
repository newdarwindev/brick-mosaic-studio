export const palette = [
  { name: 'Ivory', hex: '#f2ead7', rgb: [242, 234, 215] },
  { name: 'Ink', hex: '#273844', rgb: [39, 56, 68] },
  { name: 'Ocean', hex: '#397e93', rgb: [57, 126, 147] },
  { name: 'Sky', hex: '#93c2c6', rgb: [147, 194, 198] },
  { name: 'Coral', hex: '#df7257', rgb: [223, 114, 87] },
  { name: 'Sun', hex: '#e9b855', rgb: [233, 184, 85] },
  { name: 'Moss', hex: '#68875e', rgb: [104, 135, 94] },
  { name: 'Clay', hex: '#96735c', rgb: [150, 115, 92] },
];
/** @param {number[]} rgb */
export function nearest(rgb) {
  const distances = palette.map((color) =>
    color.rgb.reduce((sum, value, index) => sum + (value - rgb[index]) ** 2, 0),
  );
  return distances.indexOf(Math.min(...distances));
}
/** @param {Uint8ClampedArray} data */
export function quantize(data) {
  const cells = [];
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255;
    const rgb = Array.from(data.slice(i, i + 3)).map(
      (v) => v * alpha + 255 * (1 - alpha),
    );
    cells.push(nearest(rgb));
  }
  return cells;
}
/** @param {number[]} cells */
export function inventory(cells) {
  return palette.map((color, index) => ({
    ...color,
    count: cells.filter((v) => v === index).length,
  }));
}
/** @param {number[]} cells */
export function partsCsv(cells) {
  return (
    'Color,Demo hex,1x1 tile quantity\n' +
    inventory(cells)
      .filter((c) => c.count > 0)
      .map((c) => `${c.name},${c.hex},${c.count}`)
      .join('\n')
  );
}
/** @param {number[]} cells @param {number} size */
export function instructions(cells, size) {
  const lines = [
    'BRICK MOSAIC STUDIO — flat mosaic placement guide',
    `${size} × ${size} cells. One generic 1×1 tile per cell.`,
    'Rows run top to bottom; cells run left to right.',
    'Demo colors are illustrative, not official part/color IDs. Baseplate not included. Physical fit is not validated.',
    '',
  ];
  for (let row = 0; row < size; row += 1) {
    lines.push(
      `Row ${row + 1}: ${cells
        .slice(row * size, (row + 1) * size)
        .map((id) => palette[id].name)
        .join(' | ')}`,
    );
  }
  return lines.join('\n');
}
