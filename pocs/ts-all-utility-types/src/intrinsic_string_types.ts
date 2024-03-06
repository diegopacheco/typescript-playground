export function runIntrinsicStringTypes():void {
    console.log("Intrinsic String Manipulation Types");
    console.log("Uppercase<StringType>");

    type BR = Uppercase<"br">;
    let country:BR = "BR";
    console.log(country);

    console.log("Lowercase<StringType>");
    type AG = Lowercase<"ag">;
    let country2:AG = "ag";
    console.log(country2);

    console.log("Capitalize<StringType>");
    type US = Capitalize<"Us">;
    let country3:US = "Us";
    console.log(country3);

    console.log("Uncapitalize<StringType>");
    type IT = Uncapitalize<"italia">;
    let country4:IT = "italia";
    console.log(country4);
}
