// Awaited<Type>
// 
// This type is meant to model operations like
// await in async functions, or the .then() method
// on Promises - specifically, the way that they
// recursively unwrap Promises.
//
type Result = Awaited<Promise<string>>;

export async function runAwaited() {
    const asyncFunction = async () => "Result is 42";
    const myPromiseString:Result = await asyncFunction();
    console.log("Awaited<T>");
    console.log(" ",myPromiseString);
}