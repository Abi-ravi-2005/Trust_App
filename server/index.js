import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { mkdir, appendFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dataFile = resolve(root, "data", "donations.jsonl");
const port = Number(process.env.API_PORT || 3001);
const allowedAmounts = new Set([500, 1000, 2500, 5000]);

function send(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  response.end(JSON.stringify(body));
}

async function parseBody(request) {
  let raw = "";
  for await (const chunk of request) {
    raw += chunk;
    if (raw.length > 10_000) throw Object.assign(new Error("Request body is too large."), { status: 413 });
  }
  try { return JSON.parse(raw || "{}"); }
  catch { throw Object.assign(new Error("Request body must be valid JSON."), { status: 400 }); }
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  if (request.method === "GET" && pathname === "/api/health") return send(response, 200, { status: "ok", service: "aasha-trust-api" });
  if (request.method !== "POST" || pathname !== "/api/donations") return send(response, 404, { error: "Route not found." });
  if (!request.headers["content-type"]?.includes("application/json")) return send(response, 415, { error: "Send donation details as JSON." });

  try {
    const input = await parseBody(request);
    const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
    const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
    const amount = Number(input.amount);
    const cause = typeof input.cause === "string" ? input.cause.trim().slice(0, 100) : "";
    if (name.length < 2 || name.length > 80) return send(response, 400, { error: "Enter a name between 2 and 80 characters." });
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return send(response, 400, { error: "Enter a valid email address." });
    if (!allowedAmounts.has(amount)) return send(response, 400, { error: "Choose one of the available pledge amounts." });

    const pledge = { id: randomUUID(), name, email, amount, cause: cause || "Where it is needed most", status: "pledged", createdAt: new Date().toISOString() };
    await mkdir(dirname(dataFile), { recursive: true });
    await appendFile(dataFile, `${JSON.stringify(pledge)}\n`, { encoding: "utf8", mode: 0o600 });
    return send(response, 201, { message: "Pledge received.", pledge: { id: pledge.id, amount: pledge.amount, status: pledge.status, createdAt: pledge.createdAt } });
  } catch (error) {
    console.error("Donation API error:", error);
    return send(response, error.status || 500, { error: error.status ? error.message : "We could not save your pledge. Please try again." });
  }
});

server.listen(port, "127.0.0.1", () => console.log(`Aasha Trust API listening on http://127.0.0.1:${port}`));
