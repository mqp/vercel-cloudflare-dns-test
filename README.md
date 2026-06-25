# DNS Test Bench

A minimal [Next.js](https://nextjs.org) app (App Router) for testing DNS
resolution. Deploys cleanly to Vercel — no custom server, no long-lived
connections.

## What it does

- A homepage with a small UI to resolve a hostname.
- A server-side API route at `/api/lookup` that uses Node's `node:dns` to
  resolve records, so resolution happens from wherever the app is deployed.

## Usage

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

### API

```
GET /api/lookup?host=example.com&type=A
```

`type` may be one of: `A`, `AAAA`, `CNAME`, `MX`, `TXT`, `NS` (defaults to `A`).

The response includes the resolved records, the DNS servers used, and how long
resolution took — handy for DNS debugging.

## Deploy

Push to a Git repo and import it into Vercel. The `/api/lookup` route runs on
the Node.js runtime (required for `node:dns`).
