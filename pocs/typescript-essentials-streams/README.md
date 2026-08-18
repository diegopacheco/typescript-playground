# typescript-essentials-streams

Node streams: a `Readable` object source, a `Transform` that squares each value, `pipeline` to wire them together, and `for await` async iteration over a stream.

### How it works

`src/main.ts` builds a `Readable` from a generator, pipes it through a squaring `Transform` into a collecting sink with `stream/promises` `pipeline`, then separately consumes another source with `for await` to sum its values.

### Run

```bash
./run.sh
```

### Output

```
transformed stream: [ 1, 4, 9, 16, 25 ]
async iterate sum 1..4: 10
```
