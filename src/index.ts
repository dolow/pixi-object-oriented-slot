import * as PIXI from 'pixi.js';
import SlotGame from './SlotGame';

window.onload = () => {
  const game = new SlotGame();
  game.start();
};
