# typescript-essentials-jwt

JWT (HS256) built with only Node's `node:crypto`: `createHmac`, `timingSafeEqual`, and `base64url` buffers. No external dependency.

### How it works

`src/main.ts` signs a payload into a `header.payload.signature` token, verifies the signature with `timingSafeEqual`, and checks the `exp` claim. It then proves a wrong secret and an expired token are both rejected.

### Run

```bash
./run.sh
```

### Output

```
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGljZSIsInJvbGUiOiJhZG1...
verified payload: { sub: "alice", role: "admin", exp: 1783889563 }
tamper check: invalid signature
expiry check: token expired
```
