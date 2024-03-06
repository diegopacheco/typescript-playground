//
// Exclude<UnionType, ExcludedMembers>
//
// Constructs a type by excluding from UnionType all
// union members that are assignable to ExcludedMembers.
//
type BBQ = Exclude<"chiken" | "angus steak" | "entrecot", "chiken">;

let brazilianbbq:BBQ = "angus steak";
let argentinianbbq:BBQ = "entrecot";

export function runExclude():void {
    console.log("Exclude<U,Es>");
    console.log(brazilianbbq);
    console.log(argentinianbbq);
}

