//
// With interfaces
//
interface Animal {
  name: string;
}
interface Bear extends Animal {
  honey: boolean;
}
const bear: Bear = {
  name: "Yogi",
  honey: true,
};
console.log(bear.name);
console.log(bear.honey);

//
// With type and objects
//
type AnimalType = {
  name: string;
};
type BearType = AnimalType & {
  honey: boolean;
};
const bear2: BearType = {
  name: "Yogi",
  honey: true,
};
console.log(bear2.name);
console.log(bear2.honey);
