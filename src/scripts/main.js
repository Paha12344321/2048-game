'use strict';
import '../styles/main.scss';
import { Game } from '../modules/Game.class.js';


const game = new Game();

const button = document.querySelector('.button.start');
const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

button.addEventListener('click', () => {
  game.restart();
  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');
  render();
  hideMessages();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    default:
      return;
  }

  render();
  checkWinLose();
});

function render() {
  const state = game.getState();

  cells.forEach((cell, i) => {
    const value = state[Math.floor(i / 4)][i % 4];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreEl.textContent = game.getScore();
}

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: false });

document.addEventListener('touchend', (e) => {
  if (game.getStatus() !== 'playing') return;

  let touchEndX = e.changedTouches[0].screenX;
  let touchEndY = e.changedTouches[0].screenY;

  handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
}, { passive: false });

function handleSwipe(startX, startY, endX, endY) {
  const diffX = endX - startX;
  const diffY = endY - startY;

  // Порог срабатывания свайпа (чтобы не реагировать на случайные нажатия)
  if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) return;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) game.moveRight();
    else game.moveLeft();
  } else {
    if (diffY > 0) game.moveDown();
    else game.moveUp();
  }

  render();
  checkWinLose();
}



function hideMessages() {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
}

function checkWinLose() {
  const state = game.getState();
  let hasEmpty = false;
  let has2048 = false;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (state[r][c] === 0) {
        hasEmpty = true;
      }

      if (state[r][c] === 2048) {
        has2048 = true;
      }
    }
  }

  if (has2048) {
    game.status = 'win';
    messageWin.classList.remove('hidden');
  } else if (!hasEmpty) {
    game.status = 'lose';
    messageLose.classList.remove('hidden');
  }
}



