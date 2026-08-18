import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

function numberSource(count: number): Readable {
  return Readable.from(
    (function* () {
      for (let i = 1; i <= count; i++) yield i;
    })(),
  );
}

function square(): Transform {
  return new Transform({
    objectMode: true,
    transform(chunk: number, _encoding, callback) {
      callback(null, chunk * chunk);
    },
  });
}

function main(): void {
  const collected: number[] = [];

  const sink = new Transform({
    objectMode: true,
    transform(chunk: number, _encoding, callback) {
      collected.push(chunk);
      callback();
    },
  });

  pipeline(numberSource(5), square(), sink).then(async () => {
    console.log("transformed stream:", collected);

    let sum = 0;
    for await (const value of numberSource(4)) sum += value as number;
    console.log("async iterate sum 1..4:", sum);
  });
}

main();
