class DefaultLogger {
  static x = 42;
  static printX() {
    console.log("from printX method: " + DefaultLogger.x);
  }
}

console.log("From the Static var x ",DefaultLogger.x);
DefaultLogger.printX();