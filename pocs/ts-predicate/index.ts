type Fish = {
  swim: true;
};

type Bird = {
  fly: true;
};

class Elefant{}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

let nemo:Fish = {
    swim: true
};
let hawky:Bird = {
    fly: true
};

console.log(isFish(nemo));
console.log(isFish(hawky));

// Argument of type 'Elefant' is not assignable to parameter of type 'Fish | Bird'.ts(2345)
// console.log(isFish(new Elefant()));
