class Base {
  public print(): void {}
}

class Point extends Base {
  private x: number;
  private y: number;

  constructor(x = 0, y = 0) {
    super();
    this.x = x;
    this.y = y;
  }

  public print(): void {
    console.log("x ",this.x," y ", this.y);
  }
}

let p:Point = new Point(1,2);
p.print();

// Property 'x' is private and only accessible within class 'Point'.ts(2341)
p.x = 100;
// but it allow to happen in runtime x is 100.
p.print();