interface Animal {
  speak(): void;
}
  
class Dog implements Animal {
    speak(): void {
        console.log("wolf wolf");
    }
}

class Cat implements Animal {
    speak(): void {
        console.log("meown meown");
    }
}

class Elephant{
    noise(): void {
        console.log("growls aaaarh");
    }
}

type Pet = Elephant extends Animal ? Elephant : Cat;
type PetGeneric<T> = T extends Animal ? T : Cat;

let flufly:Pet = new Cat();
console.log(flufly);
console.log(flufly.speak());

let max:PetGeneric<Dog> = new Dog();
console.log(max);
console.log(max.speak());


//
// This works (because ts looks fot he functions not the class name)
//
let max3:PetGeneric<Elephant> = new Dog();
console.log(max3);
console.log(max3.speak());

//
// dont work
//
// Property 'speak' is missing in type 'Elephant' but required in type 'Cat'.ts(2741)
//
//let max4:PetGeneric<Elephant> = new Elephant();
//console.log(max4);
//console.log(max4.speak());