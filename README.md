# Aasha Trust

React and Vite frontend with a small Node.js API for recording donation pledges.

## Run locally

Open two terminals in the project directory:

```sh
npm run server
npm run dev
```

The Vite app proxies `/api` requests to the API on `127.0.0.1:3001`. Set `API_PORT` to change the API port. The API provides `GET /api/health` and `POST /api/donations`. Submitted pledges are appended to `server/data/donations.jsonl`.

## Before accepting real donations

The current API records pledges; it does not collect money, send email, issue tax receipts, authenticate staff, or provide production database backups. Configure a payment provider and its verified webhooks, transactional email, and a managed database before treating a pledge as a paid donation or deploying this API for public use. The local JSON file contains donor contact details and should be kept private.
