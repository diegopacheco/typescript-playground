# typescript-essentials-http-server

A REST server built with only Node's `node:http`: routed `GET`/`POST` handlers, JSON bodies, and status codes. No framework.

### How it works

`src/main.ts` creates an `http` server exposing `GET /todos` and `POST /todos` over an in-memory array, listens on an ephemeral port, then drives itself with the native `fetch` client to list, create, list again, and hit an unknown route (404) before closing.

### Run

```bash
./run.sh
```

### Output

```
GET /todos: [ { id: 1, title: "learn typescript", done: false } ]
POST /todos: { id: 2, title: "ship it", done: false }
GET /todos after: [ { id: 1, ... }, { id: 2, title: "ship it", done: false } ]
GET /unknown status: 404
```
