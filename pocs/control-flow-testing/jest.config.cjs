const path = require("path");

module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: {
        jsx: "react-jsx",
        module: "ESNext",
        moduleResolution: "node",
        esModuleInterop: true,
        strict: false,
        target: "ES2022",
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        skipLibCheck: true,
        types: ["jest", "@testing-library/jest-dom", "node"],
        verbatimModuleSyntax: false,
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
