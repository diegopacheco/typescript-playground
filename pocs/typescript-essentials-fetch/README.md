# typescript-essentials-fetch

The native `fetch` client: `GET`/`POST` JSON, reading text bodies, `AbortController` cancellation, and a typed `withRetry` wrapper.

### How it works

`src/main.ts` starts a tiny `node:http` server on an ephemeral port so the calls are self-contained, then uses the built-in `fetch` to read JSON and text, aborts a request with `AbortController` (catching the `AbortError`), and retries a call up to three times with a generic `withRetry`.

### Run

```bash
./run.sh
```

### Output

```
GET status: 200 application/json
GET json: { message: "hello", method: "GET" }
POST json: { message: "hello", method: "POST" }
text body: plain text
aborted: AbortError
withRetry status: 200
```
