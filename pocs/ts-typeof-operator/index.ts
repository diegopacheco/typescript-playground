type Predicate = (e:any) => boolean;
type K = ReturnType<Predicate>;

function isFeatureAEnabled(args: any): boolean {
    return true;
}

let pred:Predicate = isFeatureAEnabled;
let b:K = true;

let pred2:Predicate = function (args: any): boolean {
    return false;
} as Predicate;

console.log(pred);
console.log(pred("1"));
console.log(pred2("2"));
console.log(b);