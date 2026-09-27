# typescript-playground

Hands-on POCs of TypeScript: the language, its type system, runtimes, frameworks and tooling. Every project lives under [pocs/](pocs/) and runs on its own.

## 🧱 TypeScript Essentials

Small, focused projects on the everyday parts of the language.
Each one runs with a single `./run.sh` and uses only the standard library.

* [typescript-essentials-basics](pocs/typescript-essentials-basics/) - Loops, arrow functions, sort comparators and classes with parameter properties
* [typescript-essentials-types](pocs/typescript-essentials-types/) - Type aliases vs interfaces, discriminated unions and literal types
* [typescript-essentials-enums](pocs/typescript-essentials-enums/) - Numeric enums with reverse mapping, string enums and `const enum`
* [typescript-essentials-generics](pocs/typescript-essentials-generics/) - Generic functions, `extends` constraints, `keyof` and a generic class
* [typescript-essentials-narrowing](pocs/typescript-essentials-narrowing/) - `switch` with `never` exhaustiveness, `typeof`, `in` and type predicates
* [typescript-essentials-utility-types](pocs/typescript-essentials-utility-types/) - `Partial`, `Omit`, `Pick`, `Readonly`, `Record` and `ReturnType`
* [typescript-essentials-decorators](pocs/typescript-essentials-decorators/) - Class decorator that seals, method decorators for logging and non-writable
* [typescript-essentials-functional](pocs/typescript-essentials-functional/) - `map`, `filter`, `reduce`, closures, partial application and composition
* [typescript-essentials-error-handling](pocs/typescript-essentials-error-handling/) - `Result<T, E>` unions, custom `Error` subclass and the `cause` option
* [typescript-essentials-json](pocs/typescript-essentials-json/) - Stringify, pretty print, reviver that rebuilds `Date` and a typed `safeParse`
* [typescript-essentials-async](pocs/typescript-essentials-async/) - `async`/`await`, `Promise.all`, `race`, `allSettled` and rejections
* [typescript-essentials-generators](pocs/typescript-essentials-generators/) - Finite and infinite generators, lazy `take`, `Symbol.iterator` and `for await`
* [typescript-essentials-streams](pocs/typescript-essentials-streams/) - Node `Readable`, `Transform`, `pipeline` and async iteration
* [typescript-essentials-semaphores](pocs/typescript-essentials-semaphores/) - Async `Semaphore` that bounds concurrency to N tasks
* [typescript-essentials-workers](pocs/typescript-essentials-workers/) - `worker_threads` prime count on four threads vs one
* [typescript-essentials-fetch](pocs/typescript-essentials-fetch/) - Native `fetch`: JSON `GET`/`POST`, `AbortController` and a typed retry
* [typescript-essentials-http-server](pocs/typescript-essentials-http-server/) - REST server with only `node:http`, no framework
* [typescript-essentials-jwt](pocs/typescript-essentials-jwt/) - HS256 JWT with only `node:crypto`
* [typescript-essentials-pii-aes](pocs/typescript-essentials-pii-aes/) - PII encryption with AES-256-GCM, `scrypt` keys and tamper detection
* [typescript-essentials-tsgo](pocs/typescript-essentials-tsgo/) - Type-check a strict project with `tsgo`, the TypeScript 7 native compiler

## 🔤 Type System

Types are a small language of their own.
These projects push on unions, generics, conditional types and type-level math.

* [ts-types](pocs/ts-types/) - Basic types
* [ts-object-types](pocs/ts-object-types/) - Object types
* [ts-union-types](pocs/ts-union-types/) - Union types
* [ts-intersection](pocs/ts-intersection/) - Intersection types
* [ts-intersection-functions](pocs/ts-intersection-functions/) - Intersection of function types
* [ts-never-type](pocs/ts-never-type/) - The `never` type
* [ts-keyof](pocs/ts-keyof/) - The `keyof` operator
* [ts-typeof-operator](pocs/ts-typeof-operator/) - The `typeof` type operator
* [ts-predicate](pocs/ts-predicate/) - User-defined type predicates
* [ts-conditional-types](pocs/ts-conditional-types/) - Conditional types
* [ts-template-literals-hello-world](pocs/ts-template-literals-hello-world/) - Template literal types, first steps
* [ts-template-literals](pocs/ts-template-literals/) - Template literal types
* [ts-readonly-index](pocs/ts-readonly-index/) - Readonly index signatures
* [ts-optinal-properties-interfaces](pocs/ts-optinal-properties-interfaces/) - Optional properties on interfaces
* [ts-interface-casting](pocs/ts-interface-casting/) - Casting to interfaces
* [ts-type-and-interface-inheritance](pocs/ts-type-and-interface-inheritance/) - Inheritance with types and interfaces
* [ts-generic-classes](pocs/ts-generic-classes/) - Generic classes
* [ts-generic-object-types](pocs/ts-generic-object-types/) - Generic object types
* [ts-generic-function-constraints](pocs/ts-generic-function-constraints/) - Generic function constraints
* [ts-utility-types](pocs/ts-utility-types/) - Utility types
* [ts-all-utility-types](pocs/ts-all-utility-types/) - Every built-in utility type
* [ts-peano-numbers-axioms](pocs/ts-peano-numbers-axioms/) - Peano numbers and addition at the type level
* [hyper-typing-code](pocs/hyper-typing-code/) - Same function typed from `any` to fully generic, step by step

## 🏛️ Classes & OOP

Classes, static members, mixins and decorators.

* [ts-classes](pocs/ts-classes/) - Classes
* [ts-class-arrow-function](pocs/ts-class-arrow-function/) - Arrow functions as class members
* [ts-decorators](pocs/ts-decorators/) - Decorators
* [node-ts-basics](pocs/node-ts-basics/) - Node + TypeScript basics
* [node-ts-vars](pocs/node-ts-vars/) - Variables
* [node-ts-classes](pocs/node-ts-classes/) - Classes on Node
* [node-ts-enums](pocs/node-ts-enums/) - Enums on Node
* [node-ts-iterators](pocs/node-ts-iterators/) - Iterators on Node
* [node-ts-mixins](pocs/node-ts-mixins/) - Mixins
* [node-ts-static-methods](pocs/node-ts-static-methods/) - Static methods
* [node-ts-static-namespaces](pocs/node-ts-static-namespaces/) - Static members and namespaces
* [node-ts-util-typez](pocs/node-ts-util-typez/) - Utility types on Node

## λ Functional Programming

Pure functions, composition, lazy sequences and monads.

* [ts-high-order-functions](pocs/ts-high-order-functions/) - Higher-order functions
* [typescript-fp-pipe](pocs/typescript-fp-pipe/) - A typed `pipe` that composes functions
* [lazyrange-fp](pocs/lazyrange-fp/) - Lazy ranges with generators
* [iterator-generators-fun](pocs/iterator-generators-fun/) - Fibonacci with generators and iterators
* [sudo-for-comprehension](pocs/sudo-for-comprehension/) - Scala-like for comprehension with `where` and `select`
* [monads](pocs/monads/) - `Option` monad with `map` and `flatMap`, with tests
* [effect-fun](pocs/effect-fun/) - Effect: typed effects, schema and platform
* [string-to-binary-ts](pocs/string-to-binary-ts/) - Convert text to binary

## 🆕 TypeScript Versions

What changed in each new major release.

* [typescript-6](pocs/typescript-6/) - TypeScript 6.0: the last release on the JavaScript compiler
* [typescript-7-fun](pocs/typescript-7-fun/) - TypeScript 7.0 native port: a small site with the new features

## 🥟 Runtimes

Bun and Deno run TypeScript directly, no build step.

* [bun-fun](pocs/bun-fun/) - `Bun.serve` HTTP server with figlet
* [bun-elysiajs](pocs/bun-elysiajs/) - ElysiaJS on Bun
* [bun-elysiajs-client-server](pocs/bun-elysiajs-client-server/) - ElysiaJS server with a typed client
* [elysiajs-fun](pocs/elysiajs-fun/) - ElysiaJS basics
* [deno-fresh-project](pocs/deno-fresh-project/) - Deno Fresh with islands
* [fresh-project](pocs/fresh-project/) - Deno Fresh starter
* [deno-python-fun](pocs/deno-python-fun/) - Deno calling Python: numpy and matplotlib from TypeScript
* [opentui-fun](pocs/opentui-fun/) - OpenTUI: a Zig terminal UI core with TypeScript bindings on Bun

## ⚛️ Frontend Frameworks

The same language across every major UI framework.

* [react-ts-app](pocs/react-ts-app/) - React with Create React App
* [react-19.3-ts-7x-vite-bun](pocs/react-19.3-ts-7x-vite-bun/) - React 19.3 Server Components with Vite, Bun and TypeScript 7
* [preact-ts-app](pocs/preact-ts-app/) - Preact
* [angular-ts](pocs/angular-ts/) - Angular
* [Svelte-ts-fun](pocs/Svelte-ts-fun/) - SvelteKit
* [my-app-nuxt](pocs/my-app-nuxt/) - Nuxt 3
* [astro-ts-fun](pocs/astro-ts-fun/) - Astro
* [yup-fun](pocs/yup-fun/) - Car rental app with Astro, Yup validation, TypeScript 6 and Bun
* [bun-qwik-hydration](pocs/bun-qwik-hydration/) - Qwik resumability on a kanban board, no hydration
* [bun-ts-ripplejs-todo](pocs/bun-ts-ripplejs-todo/) - Ripple todo app with Vite
* [typed-html-fun](pocs/typed-html-fun/) - Type-safe HTML with typed-html

## 🌐 Fullstack & Next.js

Server and client in one TypeScript codebase.

* [nextjs-ts-fun](pocs/nextjs-ts-fun/) - Next.js App Router
* [nextjs-ts-fun-more](pocs/nextjs-ts-fun-more/) - Next.js App and Pages routers with Tailwind
* [nextjs-16.3-fun](pocs/nextjs-16.3-fun/) - Next.js 16.3 restaurant app with Leaflet maps
* [t3-app-simple](pocs/t3-app-simple/) - T3 stack: Next.js, tRPC and Tailwind
* [express-ts-app](pocs/express-ts-app/) - Express with TypeScript
* [express-ts-convex-mysql](pocs/express-ts-convex-mysql/) - Express backend, Next.js frontend, Convex and MySQL

## 🧭 TanStack

Router, Query, Table, Form and Charts, all fully typed.

* [ts-tansstack-fun](pocs/ts-tansstack-fun/) - Pizza shop with TanStack Router, Query, Table and Form on a Hono backend
* [tanstak-routing-paradise](pocs/tanstak-routing-paradise/) - TanStack Router file-based routing strategies side by side
* [ts-7-tanstack-chart-fun](pocs/ts-7-tanstack-chart-fun/) - TanStack Charts with React 19
* [control-flow-testing](pocs/control-flow-testing/) - JSON-defined multi-step flows that execute, show contracts and generate tests

## 🔌 API Clients

Clients generated from a schema, so the types match the server.

* [kubb-fun](pocs/kubb-fun/) - Kubb client generated from an OpenAPI spec for the Cat Facts API
* [gqty-fun](pocs/gqty-fun/) - GQty typed GraphQL queries against the SpaceX API
* [mockoon-react-fun](pocs/mockoon-react-fun/) - React 19 app whose whole backend is mocked by Mockoon

## 🧪 Testing

Unit, end-to-end and serverless tests.

* [chai-mocha-ts-testing](pocs/chai-mocha-ts-testing/) - Mocha and Chai
* [node-ts-jest](pocs/node-ts-jest/) - Jest
* [playwright-ts-testing](pocs/playwright-ts-testing/) - Playwright end-to-end tests
* [sam-local-lambda-serverless-test](pocs/sam-local-lambda-serverless-test/) - AWS Lambda tested locally with SAM and Jest

## 🛠️ Build Tools & Compilers

Bundlers, transpilers and compile-time tricks.

* [vite-ts-fun](pocs/vite-ts-fun/) - Vite
* [webpack-ts-fun](pocs/webpack-ts-fun/) - Webpack
* [babel-ts-lib](pocs/babel-ts-lib/) - A TypeScript library built with Babel
* [tsdown-fun](pocs/tsdown-fun/) - tsdown library bundler with Vitest
* [comptime-ts-fun](pocs/comptime-ts-fun/) - comptime.ts: evaluate code at compile time, like Zig
* [ts-mkdocs-fun](pocs/ts-mkdocs-fun/) - TypeScript API docs with MkDocs

## ⏱️ Benchmarks

* [ids-config-bench](pocs/ids-config-bench/) - 10k UUIDs from a JSON file loaded into a `Map`, lookup timing
