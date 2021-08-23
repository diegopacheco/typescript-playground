class Points {
    x = 0;
    y = 0;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    getX(): number { return this.x };
    getY(): number { return this.y };
    toString():string {
        return "x = " + this.x + " y = " + this.y;
    }
}

type T0 = InstanceType<typeof Points>;

let t0: T0 = {
    x: 42,
    y: 42,
    getX(): number { return this.x },
    getY(): number { return this.y },
    toString():string{
        return "x = " + this.x + " y = " + this.y;
    }
};

class StringContainer {
    s: string
    toString():string{
        return "s = " + this.s;
    }
}

type T1 = InstanceType<typeof StringContainer>;

let t1:T1 = {
    s: "this is a string",
    toString():string{
        return "s = " + this.s;
    }
}

export let resultInstaceTypes = "T0 == " + t0.toString() + " T1 == " + t1.toString();