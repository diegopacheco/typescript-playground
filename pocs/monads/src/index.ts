interface Option<T> {
    map<U>(f: (value: T) => U): Option<U>;
    flatMap<U>(f: (value: T) => Option<U>): Option<U>;
}

class Some<T> implements Option<T> {
    constructor(private value: T) {}

    map<U>(f: (value: T) => U): Option<U> {
        return new Some(f(this.value));
    }

    flatMap<U>(f: (value: T) => Option<U>): Option<U> {
        return f(this.value);
    }
}

class None<T> implements Option<T> {
    map<U>(): Option<U> {
        return new None();
    }
    flatMap<U>(f: (value: T) => Option<U>): Option<U> {
        return new None();
    }

}

export { Some, None, Option as OptionTrait };
