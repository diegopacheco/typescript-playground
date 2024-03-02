interface Wrapper<T> {
  contents: T;
}

type WrapperString = Wrapper<string>;

let toys: WrapperString = { contents: "23 toys" };
let pens: Wrapper<Number> = { contents: 11 };

console.log(toys,pens);