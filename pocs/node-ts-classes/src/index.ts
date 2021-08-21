class Point {
  x: number;
  y: number;
}
 
const pt = new Point();
pt.x = 42;
pt.y = 171;
console.log(`${pt.x}, ${pt.y}`);

class GoodGreeter {
  name: string;

  constructor() {
    this.name = "John Doe";
  }
  
  greet():string {
    return "Hello " + this.name;
  }
}

const g = new GoodGreeter();
console.log(g.greet());