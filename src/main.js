import './style.css';
import {
  palette,
  quantize,
  inventory,
  partsCsv,
  instructions,
} from './mosaic.js';
element('app').innerHTML = `
<header><a class="brand" href="./">▦ <span>BRICK / MOSAIC</span></a><span class="badge">CANNED INTERACTIVE DEMO</span></header>
<main><section class="intro"><p class="eyebrow">SMALL PIECES. BIG IDEAS.</p><h1>Make a little<br><em>masterpiece.</em></h1><p>Explore a preset picture as a colorful, flat brick mosaic.<br>Play with the grid. Follow every row. Keep the parts list.</p></section>
<section class="workspace" aria-label="Mosaic workspace"><aside><h2>01 <span>Your canvas</span></h2><label for="preset">Choose a preset</label><select id="preset"><option value="coast">Coastal sunrise</option><option value="night">Moonlit coast</option></select><p class="hint">Original preset artwork · simulated workflow.<br>No uploads, AI calls or accounts.</p><button id="sample" class="secondary">Reset sample</button><hr><h2>02 <span>The details</span></h2><label for="size">Grid size</label><select id="size"><option value="16">16 × 16 · a quick build</option><option value="24" selected>24 × 24 · balanced</option><option value="32">32 × 32 · more detail</option></select><label for="row">Build through row <output id="row-label">24 / 24</output></label><input id="row" type="range" min="1" max="24" value="24"><p class="hint">Reveal one row at a time, top to bottom.</p><label class="check"><input id="studs" type="checkbox" checked> Show studs</label><hr><button id="guide">↓ Placement guide</button><button id="parts" class="secondary">↓ Parts list · CSV</button></aside>
<div class="preview"><div class="preview-top"><span id="image-name">Sample / Coastal sunrise</span><span class="live">● READY TO EXPLORE</span></div><canvas id="mosaic" width="768" height="768" role="img" aria-label="Brick mosaic preview"></canvas><div class="stats"><div><strong id="tiles">576</strong><span>1 × 1 tiles</span></div><div><strong id="colors">8</strong><span>demo colors</span></div><div><strong id="dimensions">24 × 24</strong><span>flat grid</span></div></div><p id="status" role="status">Sample ready. Try a smaller grid or reveal the build row by row.</p></div></section>
<section class="inventory"><div><p class="eyebrow">A PALETTE WITH POSSIBILITIES</p><h2>Every piece, accounted for.</h2></div><div id="swatches"></div></section>
<footer><p>An original concept demo inspired by <a href="https://www.reddit.com/r/SideProject/comments/1x9cnre/i_built_brickschat_turn_images_into_complex_lego/">BricksChat’s public project announcement</a>. Not affiliated with BricksChat or LEGO.</p><p>This is a flat image mosaic, not AI 3D generation or a structurally validated build. Colors and tile counts are illustrative; baseplates are not included.</p><a href="./evidence/">Watch desktop & mobile test recordings ↗</a> · <a href="https://github.com/newdarwindev/brick-mosaic-studio">Source ↗</a></footer></main>`;
/** @template {HTMLElement} T @param {string} id @returns {T} */
function element(id) {
  return /** @type {T} */ (document.getElementById(id));
}
const canvas = /** @type {HTMLCanvasElement} */ (element('mosaic'));
const context = /** @type {CanvasRenderingContext2D} */ (
  canvas.getContext('2d')
);
const preset = /** @type {HTMLSelectElement} */ (element('preset'));
const sizeInput = /** @type {HTMLSelectElement} */ (element('size'));
const rowInput = /** @type {HTMLInputElement} */ (element('row'));
const studs = /** @type {HTMLInputElement} */ (element('studs'));
const source = document.createElement('canvas');
source.width = source.height = 256;
const sourceContext = /** @type {CanvasRenderingContext2D} */ (
  source.getContext('2d')
);
/** @type {number[]} */
let cells = [];

function sample() {
  sourceContext.fillStyle = preset.value === 'night' ? '#273844' : '#93c2c6';
  sourceContext.fillRect(0, 0, 256, 256);
  sourceContext.fillStyle = '#e9b855';
  sourceContext.beginPath();
  sourceContext.arc(181, 76, 38, 0, Math.PI * 2);
  sourceContext.fill();
  sourceContext.fillStyle = '#397e93';
  sourceContext.fillRect(0, 139, 256, 117);
  sourceContext.fillStyle = '#f2ead7';
  sourceContext.fillRect(140, 168, 75, 7);
  sourceContext.fillStyle = '#68875e';
  sourceContext.beginPath();
  sourceContext.moveTo(0, 70);
  sourceContext.lineTo(157, 256);
  sourceContext.lineTo(0, 256);
  sourceContext.fill();
  sourceContext.fillStyle = '#df7257';
  sourceContext.fillRect(34, 164, 27, 34);
  sourceContext.fillStyle = '#273844';
  sourceContext.beginPath();
  sourceContext.moveTo(29, 164);
  sourceContext.lineTo(47, 144);
  sourceContext.lineTo(66, 164);
  sourceContext.fill();
  element('image-name').textContent =
    preset.value === 'night'
      ? 'Preset / Moonlit coast'
      : 'Preset / Coastal sunrise';
  regenerate();
}
function regenerate() {
  const size = Number(sizeInput.value);
  const small = document.createElement('canvas');
  small.width = small.height = size;
  const ctx = /** @type {CanvasRenderingContext2D} */ (small.getContext('2d'));
  ctx.drawImage(source, 0, 0, size, size);
  cells = quantize(ctx.getImageData(0, 0, size, size).data);
  rowInput.max = String(size);
  rowInput.value = String(size);
  element('tiles').textContent = String(cells.length);
  element('dimensions').textContent = `${size} × ${size}`;
  const used = inventory(cells).filter((c) => c.count > 0);
  element('colors').textContent = String(used.length);
  element('swatches').innerHTML = used
    .map(
      (c) =>
        `<div class="swatch"><i style="background:${c.hex}"></i><span>${c.name}</span><strong>${c.count}</strong></div>`,
    )
    .join('');
  element('status').textContent =
    'Mosaic ready. Downloads include the complete grid.';
  render();
}
/** @param {number} id @param {number} index */
function tile(id, index) {
  const size = Number(sizeInput.value),
    unit = canvas.width / size;
  const x = (index % size) * unit,
    y = Math.floor(index / size) * unit;
  context.fillStyle = palette[id].hex;
  context.fillRect(x + 1, y + 1, unit - 2, unit - 2);
  if (!studs.checked) {
    return;
  }
  context.beginPath();
  context.arc(x + unit / 2, y + unit / 2, unit * 0.27, 0, Math.PI * 2);
  context.fillStyle = '#ffffff20';
  context.fill();
  context.strokeStyle = '#00000020';
  context.lineWidth = 1;
  context.stroke();
}
function render() {
  context.fillStyle = '#d6d6cb';
  context.fillRect(0, 0, canvas.width, canvas.height);
  cells
    .slice(0, Number(rowInput.value) * Number(sizeInput.value))
    .forEach(tile);
  element('row-label').textContent = `${rowInput.value} / ${sizeInput.value}`;
}
/** @param {string} content @param {string} filename */
function download(content, filename) {
  const url = URL.createObjectURL(
    new Blob([content], { type: 'text/plain;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  element('status').textContent = `Downloaded ${filename}`;
}
element('sample').addEventListener('click', () => {
  preset.value = 'coast';
  sizeInput.value = '24';
  studs.checked = true;
  sample();
});
preset.addEventListener('change', sample);
sizeInput.addEventListener('change', regenerate);
rowInput.addEventListener('input', render);
studs.addEventListener('change', render);
element('parts').addEventListener('click', () =>
  download(partsCsv(cells), 'mosaic-parts.csv'),
);
element('guide').addEventListener('click', () =>
  download(instructions(cells, Number(sizeInput.value)), 'mosaic-guide.txt'),
);
sample();
