# Cloudflare Views Counter Setup

This project now includes a Cloudflare Pages Function at `functions/api/views.js`.

## What it does

- Global view counter shared across visitors
- Prevents `+1` on every refresh (24h dedup window)
- Uses hashed visitor fingerprint (IP + user agent + visitor cookie)
- Tracks active visitors with short heartbeat TTL

## Required Cloudflare config

1. Deploy this repo to **Cloudflare Pages**.
2. Create a KV namespace (for example: `portfolio_views_kv`).
3. In your Pages project settings, add a KV binding:
   - `Variable name`: `VIEWS_KV`
   - `KV namespace`: `portfolio_views_kv`
4. Redeploy.

The frontend calls:

- `POST /api/views` on first load (counts unique visit)
- `GET /api/views` every 15s (refreshes active visitor stats)

## Notes

- On local dev (`vite`) or if KV is missing, the app falls back to localStorage-based stats automatically.
- KV is eventually consistent. For very high traffic, consider Durable Objects for strict counters.
