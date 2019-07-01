import * as PIXI from 'pixi.js';
import SlotGame from './SlotGame';
import Tween from './Tween';
import Reel from './Reel';

export default class UI extends PIXI.Container {
  public static readonly defaultTextStyle: PIXI.TextStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
  });

  private reelContainer!: PIXI.Container;
  private reelsRunning: boolean = false;

  constructor() {
    super();

    const margin = (SlotGame.height - Reel.SYMBOL_SIZE * 3) / 2;

    this.reelContainer = new PIXI.Container();
    this.reelContainer.y = margin;
    this.reelContainer.x = Math.round(SlotGame.width - Reel.WIDTH * 5);

    for (let i = 0; i < 5; i++) {
      this.reelContainer.addChild(new Reel(i));
    }

    const coverTop = new PIXI.Graphics();
    coverTop.beginFill(0, 1);
    coverTop.drawRect(0, 0, SlotGame.width, margin);

    const coverBottom = new PIXI.Graphics();
    coverBottom.beginFill(0, 1);
    coverBottom.drawRect(0, Reel.SYMBOL_SIZE * 3 + margin, SlotGame.width, margin);

    const textTop = new PIXI.Text('PIXI MONSTER SLOTS!', UI.defaultTextStyle);
    textTop.x = Math.round((coverTop.width - textTop.width) / 2);
    textTop.y = Math.round((margin - textTop.height) / 2);

    const textBottom = new PIXI.Text('Spin the wheels!', UI.defaultTextStyle);
    textBottom.x = Math.round((coverBottom.width - textBottom.width) / 2);
    textBottom.y = SlotGame.height - margin + Math.round((margin - textBottom.height) / 2);

    coverTop.addChild(textTop);
    coverBottom.addChild(textBottom);

    this.addChild(this.reelContainer);
    this.addChild(coverTop);
    this.addChild(coverBottom);

    coverBottom.interactive = true;
    coverBottom.buttonMode = true;
    coverBottom.addListener('pointerdown', () => this.startPlay());
  }

  public startPlay(): void {
    if (this.reelsRunning) {
      return;
    }

    this.reelsRunning = true;

    const reels = this.reelContainer.children;
    for (let i = 0; i < reels.length; i++) {
      const reel = reels[i] as Reel;
      if (!reel.update) {
        continue;
      }
      const extra = Math.floor(Math.random() * 3);
      const target = reel.index + 10 + i * 5 + extra;
      const time = 2500 + i * 600 + extra * 600;
      const tween = new Tween(
        reel,
        'index',
        target,
        time,
        Tween.backout(0.5),
        null,
        i === reels.length - 1 ? () => { this.reelsRunning = false; } : null,
      );
      Tween.tweening.push(tween);
    }
  }

  public update(): void {
    const reels = this.reelContainer.children;
    for (let i = 0; i < reels.length; i++) {
      const reel = reels[i] as Reel;
      if (!reel.update) {
        continue;
      }
      reel.update();
    }

    Tween.update();
  }
}
