let someArray = [1, "string", false];
for (let entry of someArray) {
  console.log(entry); // 1, "string", false
}

// in vs of 
let list = [4, 5, 6];
for (let i in list) {
  console.log(i); // "0", "1", "2",
}
for (let i of list) {
  console.log(i); // 4, 5, 6
}

let pets = new Set(["Cat", "Dog", "Hamster"]);
pets["species"] = "mammals";
for (let pet in pets) {
  console.log(pet); // "species"
  console.log(pets[pet]); // "mamals"
}
for (let pet of pets) {
  console.log(pet); // "Cat", "Dog", "Hamster"
}