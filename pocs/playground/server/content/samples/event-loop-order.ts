const log: string[] = [];
const step = (label: string): void => {
  log.push(label);
  console.log(`${String(log.length).padStart(2)}. ${label}`);
};

step("sync: script start");

setTimeout(() => {
  step("macrotask: setTimeout 0");
  Promise.resolve().then(() => step("microtask: inside setTimeout"));
}, 0);

setTimeout(() => step("macrotask: setTimeout 10"), 10);

Promise.resolve()
  .then(() => step("microtask: then 1"))
  .then(() => step("microtask: then 2"));

queueMicrotask(() => step("microtask: queueMicrotask"));

(async () => {
  step("sync: async fn body before await");
  await null;
  step("microtask: after await");
})();

new Promise<void>((resolve) => {
  step("sync: promise executor");
  resolve();
}).then(() => step("microtask: executor promise then"));

step("sync: script end");

await new Promise((resolve) => setTimeout(resolve, 30));
console.log(`total steps: ${log.length}`);
