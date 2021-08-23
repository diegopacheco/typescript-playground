import { cats } from './records';
import { obj2 } from './requireds';
import { todo2 } from './partials';
import { todo } from './picks';
import { todoOmit } from './omits';
import { resultExclude } from './excludes';
import { extractResult } from './extracts';
import { NonNullableResult } from './nonnullables';
import { parametersResult } from './parameters';
import { constructorParametersResult } from './constructorparameters';
import { returnTypeResult } from './returntypes';

// Partial Type
console.log("Partial ",todo2);

// Required Type
console.log("Required ",obj2);

// Records Type
console.log("Records ",cats.boris);

// Pick Type
console.log("Pick  ",todo);

// Omit Type
console.log("Omit ",todoOmit);

// Exclude T from U 
console.log("Exclude ",resultExclude);

// Extract type must be in T and U
console.log("Extract ",extractResult);

// NonNullable
console.log("NonNullable ", NonNullableResult);

// Parameters
console.log("Parameters ",parametersResult);

// ConstructorParameter
console.log("ConstructorParameter ", constructorParametersResult);

// ReturnType 
console.log("RetutnType ",returnTypeResult);