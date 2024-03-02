type fnConsumerVoid = () => void;
type fnConsumerStr = (a: string) => void;

function printToConsole(s: string): void {
  console.log(s);
}

function greeter(fn: fnConsumerStr): fnConsumerVoid {
  return function () {
    fn("Lazy: Hello, World from TS - High Order Functions Baby");
  };
}

let lazyResult: fnConsumerVoid = greeter(printToConsole);
console.log(lazyResult);
console.log(lazyResult());
console.log(lazyResult.apply(0));
