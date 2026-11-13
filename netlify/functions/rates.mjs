/*
 * ExpatGuideME community rates API
 *
 * GET  /api/rates?from=SAR&to=INR
 *      -> { market: { rate, at }, providers: { id: { rate, at, n } }, history: [{ d, r }] }
 * POST /api/rates  { from, to, provider, rate, fee, website }
 *      -> { ok: true, provider: { rate, fee, at, n } }
 *
 * Rates are shared by visitors. A rate is accepted only when it is within
 * 10% of the live market rate, and the same visitor can update the same
 * provider in the same corridor once every 10 minutes.
 */
import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";

const SOURCES = ["SAR", "AED", "KWD", "QAR", "OMR", "BHD"];
const DESTS = ["INR", "PKR", "NPR", "BDT", "PHP", "LKR", "IDR", "EGP"];
const PROVIDERS = {
  SAR: ["stcbank", "urpay", "barq", "enjaz", "tahweel", "snbquickpay", "tiqmo", "mobilypay", "fawri", "wu"],
  AED: ["alansari", "lulu", "alfardan", "gccexchange", "wallstreet", "wu", "remitly", "wise"],
  KWD: ["almulla", "bec", "uaeexchangekw", "lulu", "wu"],
  QAR: ["aldar", "alzaman", "lulu", "alfardan", "ooredoo", "wu"],
  OMR: ["lulu", "unimoni", "modern", "purshottam", "omantel", "wu"],
  BHD: ["bfc", "lulu", "beyon", "nec", "wu"]
};
const MAX_DEVIATION = 0.1;
const RATE_LIMIT_MS = 10 * 60 * 1000;
const MARKET_TTL_MS = 60 * 60 * 1000;
const HISTORY_DAYS = 180;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

async function marketRates(store) {
  const cached = await store.get("market", { type: "json" });
  if (cached && Date.now() - cached.at < MARKET_TTL_MS) return cached;
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    if (data && data.result === "success" && data.rates) {
      const fresh = { at: Date.now(), source: data.time_last_update_unix * 1000, rates: data.rates };
      await store.setJSON("market", fresh);
      return fresh;
    }
  } catch (e) {
    /* fall through to cached copy */
  }
  return cached;
}

function pairRate(market, from, to) {
  if (!market || !market.rates[from] || !market.rates[to]) return null;
  return market.rates[to] / market.rates[from];
}

async function recordHistory(store, key, rate) {
  const day = new Date().toISOString().slice(0, 10);
  const history = (await store.get(key, { type: "json" })) || [];
  if (!history.length || history[history.length - 1].d !== day) {
    history.push({ d: day, r: Number(rate.toPrecision(6)) });
    while (history.length > HISTORY_DAYS) history.shift();
    await store.setJSON(key, history);
  }
  return history;
}

export default async (req, context) => {
  const store = getStore("community-rates");

  if (req.method === "GET") {
    const url = new URL(req.url);
    const from = (url.searchParams.get("from") || "").toUpperCase();
    const to = (url.searchParams.get("to") || "").toUpperCase();
    if (!SOURCES.includes(from) || !DESTS.includes(to)) return json({ error: "corridor" }, 400);
    const market = await marketRates(store);
    const rate = pairRate(market, from, to);
    const history = rate ? await recordHistory(store, `h:${from}-${to}`, rate) : [];
    const corridor = (await store.get(`c:${from}-${to}`, { type: "json" })) || { p: {} };
    return json({
      market: rate ? { rate, at: market.source || market.at } : null,
      providers: corridor.p,
      history
    });
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch (e) { return json({ error: "body" }, 400); }
    if (body.website) return json({ ok: true });
    const from = String(body.from || "").toUpperCase();
    const to = String(body.to || "").toUpperCase();
    const provider = String(body.provider || "");
    const rate = Number(body.rate);
    if (!SOURCES.includes(from) || !DESTS.includes(to)) return json({ error: "corridor" }, 400);
    if (!PROVIDERS[from].includes(provider)) return json({ error: "provider" }, 400);
    if (!isFinite(rate) || rate <= 0) return json({ error: "rate" }, 400);
    const fee = body.fee === null || body.fee === undefined || body.fee === "" ? null : Number(body.fee);

    const market = await marketRates(store);
    const mid = pairRate(market, from, to);
    if (!mid) return json({ error: "market" }, 503);
    if (Math.abs(rate / mid - 1) > MAX_DEVIATION) return json({ error: "range", market: mid }, 422);
    if (fee !== null && (!isFinite(fee) || fee < 0 || fee / market.rates[from] > 60)) return json({ error: "fee" }, 422);

    const ip = (context && context.ip) || req.headers.get("x-nf-client-connection-ip") || "unknown";
    const who = createHash("sha256").update(ip + "|expatguideme").digest("hex").slice(0, 24);
    const limitKey = `l:${who}:${from}-${to}:${provider}`;
    const last = await store.get(limitKey, { type: "json" });
    if (last && Date.now() - last.at < RATE_LIMIT_MS) return json({ error: "wait" }, 429);
    await store.setJSON(limitKey, { at: Date.now() });

    const key = `c:${from}-${to}`;
    const corridor = (await store.get(key, { type: "json" })) || { p: {} };
    const old = corridor.p[provider] || { n: 0 };
    corridor.p[provider] = {
      rate: Number(rate.toPrecision(7)),
      fee: fee === null ? (old.fee !== undefined ? old.fee : null) : Number(fee.toFixed(3)),
      at: Date.now(),
      n: old.n + 1
    };
    await store.setJSON(key, corridor);
    return json({ ok: true, provider: corridor.p[provider] });
  }

  return json({ error: "method" }, 405);
};

export const config = { path: "/api/rates" };
