// implement identidy
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
    flatMap<U>(f: (value: T) => OptionTrait<U>): OptionTrait<U> {
        return new None();
    }

}
export { Some, None, OptionTrait };
