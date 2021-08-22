import { cats } from './records';
import { obj2 } from './requireds';
import { todo2 } from './partials';
import { todo } from './picks';

// Partial Type
console.log("Partial ",todo2);

// Required Type
console.log("Required ",obj2);

// Records Type
console.log("Records ",cats.boris);

// Pick Type
console.log("Pick  ",todo);