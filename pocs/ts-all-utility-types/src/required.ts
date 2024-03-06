interface Props {
  a?: number;
  b?: string;
}

const obj: Props = { a: 5 };

// Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.ts(2741)
//const obj2: Required<Props> = { a: 5 };

const obj3: Required<Props> = { a: 42, b:"ts is cool" };

export function runRequired():void {
    console.log("Required<T>");
    console.log(obj3);
}