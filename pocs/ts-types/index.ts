type Email = String;

function printMail(mail:Email):void {
    console.log(mail);
}

let johnMail:Email = "jhon@doe.com";
printMail(johnMail);

//
// Argument of type 'number' is not assignable to parameter of type 'String'.ts(2345)
//
// printMail(42);

type Team = "Gremio" | "Inter";

function printTeam(team:Team):void {
    if ("Gremio"===team){
       console.log("The best ${team} !")
    } else {
        console.log("meh ok ${team} !")
    }
}

printTeam("Gremio");

//
// Argument of type '"Juventude"' is not assignable to parameter of type 'Team'.ts(2345)
//
// printTeam("Juventude");