const path = require("path");

module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["@swc/jest", {
      jsc: {
        parser: { syntax: "typescript", tsx: true },
        transform: { react: { runtime: "automatic" } },
      },
    }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  roots: ["/tmp/cft-tests"],
  testMatch: ["**/*.test.tsx"],
  modulePaths: [path.resolve(__dirname, "node_modules")],
  moduleDirectories: ["node_modules", path.resolve(__dirname, "node_modules")],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
};
