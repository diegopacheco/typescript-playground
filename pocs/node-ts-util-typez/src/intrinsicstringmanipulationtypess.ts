/*
 * Intrinsic String Manipulation Types
 * Uppercase<StringType>
 * Lowercase<StringType>
 * Capitalize<StringType>
 * Uncapitalize<StringType>
 */
type Greeting = "Hello, world"
type ShoutyGreeting = Uppercase<Greeting>
// try to add any other string - does not work!
let x:ShoutyGreeting = "HELLO, WORLD";

type GreetingLower = "hello, world"
type ShoutyGreetingLower = Lowercase<GreetingLower>
// try to add any other string - does not work!
let y:ShoutyGreetingLower = "hello, world";

type GreetingCap = "Helloworld"
type ShoutyGreetingCap = Capitalize<GreetingCap>
// try to add any other string - does not work!
let z:ShoutyGreetingCap = "Helloworld";

type GreetingUncap = "helloworld"
type ShoutyGreetingUncap = Uncapitalize<GreetingUncap>
// try to add any other string - does not work!
let w:ShoutyGreetingUncap = "helloworld";

export let stringLiteralsClasses = " \n Uppercase  = " + x + " \n" +
                                   " Lowercase  = " + y + " \n" +
                                   " Capitalize = " + z + " \n" +
                                   " Uncapitalize  = " + w + " \n";
