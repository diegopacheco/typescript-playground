class Calculator{
    sum(va:number, vb:number):number {
        return va + vb;
    }
    sub(va:number, vb:number):number {
        return va - vb;
    }
    mul(va:number, vb:number):number {
        return va * vb;
    }
    div(va:number, vb:number):number {
        return va / vb;
    }
}

export let calculator:Calculator = new Calculator();