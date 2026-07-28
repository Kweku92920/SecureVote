# Running SecureVote at high concurrency (~10k simultaneous voters)

The API is tuned for lean responses (gzip compression, lighter `/results`, batched CSV import routes, aggregated vote counts).

To sustain **many thousands of concurrent ballots**, plan for horizontal scale and infra, not Node alone:

1. **Stateless Node** — Deploy multiple instances behind a load balancer; each instance runs the same `server.js`.
2. **MongoDB sizing** — Use a cluster tier that maintains low latency under concurrent writes; indexes on `Vote` (`electionId`, `voterId`) and duplicate-vote uniqueness help.
3. **Connection limits** — Use the Prisma `DATABASE_URL` with a pooled connection string (MongoDB Atlas or a pooler) so each app instance does not open unbounded connections.
4. **Turn off verbose HTTP logging in production** — `morgan` is disabled when `NODE_ENV=production`.
5. **Optional next steps** — Rate limiting at the edge, Redis-based queue for peak spikes, read replicas for heavy reporting queries.

Local load testing: use [k6](https://k6.io/) or `autocannon` against `/api/health` and scripted `POST /api/votes` with many unique voter IDs to validate your cluster.
