const str = 'Hello World';
function textToBinary(str:string): string {
   let res:string = "";
   res = str.split('').map(char => {
      return char.charCodeAt(0).toString(2);
   }).join(' ');
   return res;
};
console.log("bat " + textToBinary('bat'));
console.log("cat " + textToBinary('cat'));
console.log("tac " + textToBinary('tac'));