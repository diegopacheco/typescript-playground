# kubb-fun

TypeScript API client auto-generated from OpenAPI spec using [Kubb](https://kubb.dev/). Hits the public [Cat Facts API](https://catfact.ninja/) to fetch random cat facts, paginated facts, and cat breeds.

## What is Kubb?

Kubb is a powerful OpenAPI code generator that reads your `openapi.yml` and spits out fully typed TypeScript clients, Zod schemas, faker mocks, and more. No hand-writing API calls ever again.

## Stack

* Node.js 24
* TypeScript 5.7
* Kubb 4.37 (plugin-oas, plugin-ts, plugin-client, plugin-zod, plugin-faker)
* Axios (HTTP client)
* Jest + ts-jest (testing)

## Generated Code

Kubb generates the following from `openapi.yml` into `src/gen/`:

```
src/gen/
  clients/     - typed API client functions (getRandomFact, getFacts, getBreeds)
  models/      - TypeScript interfaces (CatFact, CatBreed, FactsResponse, etc.)
  zod/         - Zod validation schemas
  mocks/       - Faker-based mock data generators
  schemas/     - JSON schemas
```

## API Endpoints

| Endpoint | Function | Description |
|----------|----------|-------------|
| `GET /fact` | `getRandomFact()` | Get a single random cat fact |
| `GET /facts` | `getFacts()` | Get paginated list of cat facts |
| `GET /breeds` | `getBreeds()` | Get paginated list of cat breeds |

## How to Run

```bash
./run.sh
```

## How to Test

```bash
./test.sh
```

## Build from Scratch

```bash
npm install
npx kubb generate
npx ts-node src/index.ts
npx jest --verbose
```
