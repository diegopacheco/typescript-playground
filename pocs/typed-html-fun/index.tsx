import * as elements from 'typed-html';

const w = 'world';
const helloWorld = <p>Hello <strong>{w}</strong></p>;

// => Just a string of course
console.log(typeof helloWorld); 
console.log(helloWorld)