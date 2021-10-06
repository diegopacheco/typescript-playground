/**
 * Required<Type>
 * Constructs a type consisting of all properties of Type set to required. 
 * The opposite of Partial.
 */
interface Props {
    a?: number;
    b?: string;
}
const obj: Props = { a: 5 };
export const obj2: Required<Props> = { a: 5, b: "ok" };
//const obj2: Required<Props> = { a: 5 };
//Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.