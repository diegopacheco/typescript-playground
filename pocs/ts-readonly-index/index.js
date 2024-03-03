var taxArray = ["7%", "8%", "12%", "20%", "40%"];
console.log(taxArray);
// Index signature in type 'ReadonlyTaxArray' only permits reading.ts(2542)
taxArray[0] = "100%";
// TS complain but let you do it.
console.log(taxArray);
