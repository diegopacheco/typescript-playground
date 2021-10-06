/**
 * ThisParameterType<Type>
 * Extracts the type of the this parameter for a 
 * function type, or unknown if the function type has no this parameter.
 */
function toHex(this: Number) {
    return this.toString(16);
}

export function numberToString(n: ThisParameterType<typeof toHex>) {
    return toHex.apply(n);
}