import './style.css';
import { changeCount } from './counter.js';
const output = document.querySelector('output');
let count = 0;
/** @param {number} value */
function render(value) {
  count = value;
  if (output) {
    output.value = String(count);
  }
}
document
  .querySelector('#add')
  ?.addEventListener('click', () => render(changeCount(count, 1)));
document
  .querySelector('#subtract')
  ?.addEventListener('click', () => render(changeCount(count, -1)));
document.querySelector('#reset')?.addEventListener('click', () => render(0));
