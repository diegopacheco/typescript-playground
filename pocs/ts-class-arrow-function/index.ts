interface Greeter{
    greet(name:string ):string
}

class EnglishGreeter implements Greeter {
  greet = (n:string) => {
    return `hello ${n}`;
  };
}

let eg:Greeter = new EnglishGreeter();
console.log(eg.greet("John Doe"));