### Rationale

1. Generate 10k unique IDs.
2. Store them in a JSON file.
3. Load the IDs into memory using a Map when server bootup.
4. Do a HashMap lookup for each ID.

### Performance Benchmarks

```bash
❯ npm run start

> ids-config-bench@1.0.0 start
> node dist/server.js

Loaded 10000 IDs into memory in 4.25 milliseconds
Server running on port 3000
HashMap lookup for ID 72d18cca-d207-49db-ae43-3c5700de8995 took 0.0032 milliseconds - FOUND
HashMap lookup for ID 00000000-0000-0000-0000-000000000000 took 0.0025 milliseconds - NOT FOUND
```