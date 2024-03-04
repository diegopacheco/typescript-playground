function debug(id: number | string) {
  console.log("Your ID is: " + id);
}

debug(25);
debug("123");

function validate(cc: { num:Number } | { num:string }):bool {
  if (typeof cc.num !== "undefined"){
    let n:number = +cc.num;
    if (n > 0) {
      return true;
    }
  }
  return false;
}

console.log(validate( {
  num: 42
}));
console.log(validate( { num: "42" }));
console.log(validate( { num: "-1" }));