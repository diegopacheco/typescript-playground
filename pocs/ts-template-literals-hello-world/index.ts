"use strict";

type World = "world";
type Greeting = `hello ${World}`;

let englishGreeting:Greeting = "hello world";
console.log(englishGreeting);

//
// TS complains but the code works at runtime.
//
// Type '"hello mundo"' is not assignable to type '"hello world"'.ts(2322)
//
//let spanishGreeting:Greeting = "hello mundo";
//console.log(spanishGreeting);