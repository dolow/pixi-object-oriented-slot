import * as PIXI from 'pixi.js';
import UI from './UI';

export default class SlotGame {
  public static readonly width: number = 800;
  public static readonly height: number = 640;
  public static readonly resources: string[] = [
    '/assets/animalface_kangaroo.png',
    '/assets/animalface_kirin.png',
    '/assets/animalface_tanuki.png',
    '/assets/animalface_usagi.png'
  ];

  private app!: PIXI.Application;
  private ui!: UI;
  private onReady: () => void = () => {};

  constructor() {
    if (!document.body) {
      throw new Error('window is not ready');
    }
    Debug: {
      // pixiAppOption.preserveDrawingBuffer = true;
      document.body.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'c') {
          const a = document.createElement('a');

          a.setAttribute('href', this.app.view.toDataURL());
          a.setAttribute('download', `figure_${new Date().getTime()}`);
          a.click();
        }
      });
    }
    this.app = new PIXI.Application({
      width: SlotGame.width,
      height: SlotGame.height,
      backgroundColor: 0x1099bb,
        preserveDrawingBuffer: true
    });
    document.body.appendChild(this.app.view);

    for (let i = 0; i < SlotGame.resources.length; i++) {
      const resource = SlotGame.resources[i];
      this.app.loader.add(resource);
    }

    this.app.loader.load(() => {
      this.ui = new UI();
      this.onReady();
    });
  }

  public start(): void {
    if (!this.ui) {
      this.onReady = () => this.start();
      return;
    }
    this.app.stage.addChild(this.ui);
    this.app.ticker.add(() => {
      this.ui.update();
    });
  }
}
