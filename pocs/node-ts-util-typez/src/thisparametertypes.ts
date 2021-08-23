function toHex(this: Number) {
    return this.toString(16);
}

export function numberToString(n: ThisParameterType<typeof toHex>) {
    return toHex.apply(n);
}