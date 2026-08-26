# Changelog

Records every user-visible change to mockoon-react-fun.

## 1.0.0 - 2026-08-25

### Added

- Six OpenAPI 3 specs under `spec/` covering books, calculator, gallery, notes, rock paper scissors and blog, each marking its paths with an `x-mockoon` directive that says whether the mock should serve them as a stateful CRUD resource or compute them from a template.
- A generator that hands every spec to the Mockoon CLI importer, turns the imported routes into six stateful CRUD routes bound to in-memory data buckets, seeds those buckets, and writes a single validated Mockoon environment.
- Books tab with a sortable, searchable grid; clicking a row loads it into the editor, and search, sort and order are answered by the mock rather than filtered in the page.
- Calculator tab that posts its operands and shows the mock's answer; the mock evaluates the expression and appends every accepted calculation to a history that survives across requests.
- Gallery tab that accepts pictures dropped from the machine or added by URL, shows them in a grid, opens a full-size overlay on click, and deletes on demand.
- Notes tab with a title, free text and a checklist per note; ticking a box on a saved note sends only the changed checklist, and the mock merges it into the stored record.
- Rock paper scissors tab where the mock picks its move, decides the winner and records the round, with a running win-draw-loss tally and full round history.
- Mini blog tab for writing, editing and deleting posts with tags, a cover picture from a URL or an upload, and an embedded YouTube video parsed from watch, share, embed or shorts links.
- A request log along the bottom of every screen showing the method, path, status and latency of each call as it is made.
- `start.sh`, `stop.sh`, `build.sh` and `test.sh`, which generate the mock, run both processes on fixed ports, and stop them again; ports are overridable with `MOCK_PORT` and `WEB_PORT`.
- Division by zero returns a 400 with a readable message instead of an unusable result, and an unknown game move is rejected the same way.

### Verified

- 39 of 39 API checks pass against a live mock with no skips, covering create-then-list persistence, server-side search and sorting, `X-Total-Count`, update keeping its id, 404 on a missing record, the five arithmetic operators, the divide-by-zero rejection, correct round outcomes across 40 plays with varied computer moves, a 200 KB data URL surviving a round trip, and checklist merging.
- All six tabs were driven in a real browser with no console or page errors; creating, editing and deleting a book through the form was confirmed to persist in the mock and disappear again.
- Typechecks clean under the Go-native TypeScript 7 compiler, and the production bundle builds at 224 KB.
