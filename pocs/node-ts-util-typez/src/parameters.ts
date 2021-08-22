declare function func1(arg: { a: number; b: string }): void;

type T3 = Parameters<typeof func1>;

let t3:T3 = [{
    a: 42,
    b: "str",
}]

export let parametersResult = t3;