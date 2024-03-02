interface LogOptions {
  sufix: String;
  id?: number;
  reason?: number;
}

function printMe(s: String, opt: LogOptions): void {
  let extra: String = "";
  if (typeof opt.id !== "undefined") {
    extra += "id: " + opt.id + "";
  }
  if (typeof opt.reason !== "undefined") {
    extra += "reason: " + opt.reason + "";
  }
  console.log(opt.sufix + " " + s + " " + extra);
}

printMe("Optinal Properties in Interfaces", {
  sufix: "***",
  id: 42,
});
