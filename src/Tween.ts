export default class Tween {
  public static tweening: Tween[] = [];

  public propertyBeginValue: any;
  public start: number = Date.now();

  constructor(
    public object: any,
    public property: string,
    public target: number,
    public time: number,
    public easing: (t: number) => number,
    public change: (tween: Tween) => void | null,
    public complete: (tween: Tween) => void | null
  ) {
    this.propertyBeginValue = object[property];
  }

  public static update(): void {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < Tween.tweening.length; i++) {
      const tween = Tween.tweening[i];
      const phase = Math.min(1, (now - tween.start) / tween.time);

      tween.object[tween.property] = Tween.lerp(tween.propertyBeginValue, tween.target, tween.easing(phase));
      if (tween.change) {
        tween.change(tween);
      }
      if (phase === 1) {
        tween.object[tween.property] = tween.target;
        if (tween.complete) {
          tween.complete(tween);
        }
        remove.push(tween);
      }
    }
    for (let i = 0; i < remove.length; i++) {
      Tween.tweening.splice(Tween.tweening.indexOf(remove[i]), 1);
    }
  }

  public static backout(amount: number): (t: number) => number {
    return t => (--t * t * ((amount + 1) * t + amount) + 1);
  }

  public static lerp(a1: number, a2: number, t: number): number {
    return a1 * (1 - t) + a2 * t;
  }
}
