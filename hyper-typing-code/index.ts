function printPropertyV1(obj, key) {
    if (typeof obj === "object" && obj !== null && Object.hasOwn(obj, key)) {
      return obj[key];
    }
  }

console.log("---> V1");
console.log(printPropertyV1({ name: "John" }, "name")); // John

function printPropertyV2(obj: any, key: string) {
    if (typeof obj === "object" && obj !== null && Object.hasOwn(obj, key)) {
        return obj[key];
    }
}

console.log("---> V2");
console.log(printPropertyV2({ name: "John" }, "name")); // John

function printPropertyV3<Obj extends object>(obj: Obj, key: keyof Obj) {
    return obj[key];
}

console.log("---> V3");
console.log(printPropertyV3({ name: "John" }, "name")); // John