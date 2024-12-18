interface OptionTrait<T> {
    map<U>(f: (value: T) => U): OptionTrait<U>;
    flatMap<U>(f: (value: T) => OptionTrait<U>): OptionTrait<U>;
}

class Some<T> implements OptionTrait<T> {
    constructor(private value: T) {}

    map<U>(f: (value: T) => U): OptionTrait<U> {
        return new Some(f(this.value));
    }

    flatMap<U>(f: (value: T) => OptionTrait<U>): OptionTrait<U> {
        return f(this.value);
    }
}

class None<T> implements OptionTrait<T> {
    map<U>(): OptionTrait<U> {
        return new None();
    }

    flatMap<U>(): OptionTrait<U> {
        return new None();
    }
}

const some = new Some(5);
const none = new None();
const result = some.flatMap((value) => new Some(value + 5));
console.log(result);
