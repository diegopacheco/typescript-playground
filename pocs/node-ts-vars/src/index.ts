let hello = "Hello!";
console.log(hello);

function f(input: boolean) {
  let a = 100;
  if (input) {
    // Still okay to reference 'a'
    let b = a + 1;
    return b;
  }
  // Error: 'b' doesn't exist here
  //return b;
}
console.log(f(true));

try {
  throw "oh no!";
} catch (e) {
  console.log("Oh well.");
}
// Error: 'e' doesn't exist here
//console.log(e);

function theCityThatAlwaysSleeps() {
  let getCity;
  if (true) {
    let city = "Seattle";
    getCity = function () {
      return city;
    };
  }
  return getCity();
}
console.log(theCityThatAlwaysSleeps());

const numLivesForCat = 9;
const kitty = {
  name: "Aurora",
  numLives: numLivesForCat,
};
console.log(numLivesForCat);
console.log(kitty);

// Array destructuring
let input = [1, 2];
let [first, second] = input;
console.log(first); // outputs 1
console.log(second); // outputs 2

// Tuttpe destructuring
let tuple: [number, string, boolean] = [7, "hello", true];
let [a, b, c] = tuple; // a: number, b: string, c: boolean
console.log(a,b,c);

// Object destructuring
let o = {
  x: "foo",
  y: 12,
  z: "bar",
};
let { x, y } = o;
console.log(x,y);