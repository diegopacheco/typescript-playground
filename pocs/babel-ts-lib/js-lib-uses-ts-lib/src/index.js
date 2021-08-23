const requireLocal = require('app-root-path').require
const tsLib = requireLocal('../lib-ts/dist/');

console.log(tsLib.bc.toString());