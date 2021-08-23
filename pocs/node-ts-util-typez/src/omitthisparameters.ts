function toHex(this: Number) {
    return this.toString(16);
}

export const fiveToHex:OmitThisParameter<typeof toHex> = toHex.bind(5);