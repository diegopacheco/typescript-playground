/*
* Constructs a tuple or array type from the types of a constructor 
* function type. It produces a tuple type with all the parameter types 
* (or the type never if Type is not a function).
* 
*/
type T0 = ConstructorParameters<ErrorConstructor>;
let t0:T0 = ["This is a message"];
export let constructorParametersResult = t0;