/**
 * ExpatGuideME community rates API (Google Apps Script web app, free).
 *
 * Same API the send-money page used on Netlify:
 *   GET  <web app URL>?from=SAR&to=INR
 *        -> { market: { rate, at }, providers: { id: { rate, fee, at, n } }, history: [{ d, r }] }
 *   POST <web app URL>   body (text/plain) = JSON { from, to, provider, rate, fee, website }
 *        -> { ok: true, provider: { rate, fee, at, n } }   or   { error: "range" | "fee" | "wait" | ... }
 *
 * Rates are shared by visitors who have just checked them in a provider's app.
 * A rate is accepted only when it is within 5% of the live market rate, for a
 * provider the site lists for that country. The same provider in the same
 * corridor can be updated once every 2 minutes (Apps Script cannot see visitor
 * IP addresses, so the limit is per provider, not per visitor).
 * Every accepted update is also written to the "log" sheet of the spreadsheet
 * named in LOG_SHEET_ID (optional), so the Manager can review or undo spam.
 *
 * Set up (one time, about 5 minutes):
 *  1. Open https://script.new while signed in to the Google account for the site.
 *  2. Delete the sample code, paste this whole file, name the project "ExpatGuideME rates".
 *  3. Deploy > New deployment > type "Web app": Execute as = Me, Who has access = Anyone.
 *  4. Authorize when Google asks, then copy the "Web app URL" (ends with /exec).
 *  5. Put that URL in _src/data/site.json as "rates_api" and push (or send it to Claude).
 */

var SOURCES = ["SAR", "AED", "KWD", "QAR", "OMR", "BHD"];
var DESTS = ["INR", "PKR", "NPR", "BDT", "PHP", "LKR", "IDR", "EGP"];
var COUNTRY = { SAR: "sa", AED: "ae", KWD: "kw", QAR: "qa", OMR: "om", BHD: "bh" };
var PROVIDERS_URL = "https://expatguideme.com/assets/providers.json";
var MAX_DEVIATION = 0.05;
var LIMIT_SECONDS = 120;
var HISTORY_DAYS = 180;
var LOG_SHEET_ID = ""; // optional: ID of a Google Sheet to keep a log of every update

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function props_() { return PropertiesService.getScriptProperties(); }

function getJson_(key, fallback) {
  var v = props_().getProperty(key);
  if (!v) return fallback;
  try { return JSON.parse(v); } catch (e) { return fallback; }
}

function setJson_(key, value) { props_().setProperty(key, JSON.stringify(value)); }

function market_() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get("market");
  if (hit) return JSON.parse(hit);
  try {
    var res = UrlFetchApp.fetch("https://open.er-api.com/v6/latest/USD", { muteHttpExceptions: true });
    var d = JSON.parse(res.getContentText());
    if (d && d.result === "success" && d.rates) {
      var m = { at: d.time_last_update_unix * 1000, rates: d.rates };
      cache.put("market", JSON.stringify(m), 3600);
      setJson_("market", m);
      return m;
    }
  } catch (e) { /* use the saved copy below */ }
  return getJson_("market", null);
}

function allowed_() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get("providers");
  if (hit) return JSON.parse(hit);
  try {
    var res = UrlFetchApp.fetch(PROVIDERS_URL, { muteHttpExceptions: true });
    if (res.getResponseCode() === 200) {
      var p = JSON.parse(res.getContentText());
      cache.put("providers", JSON.stringify(p), 21600);
      setJson_("providers", p);
      return p;
    }
  } catch (e) { /* use the saved copy below */ }
  return getJson_("providers", {});
}

function pair_(m, from, to) {
  return m && m.rates[from] && m.rates[to] ? m.rates[to] / m.rates[from] : null;
}

function history_(from, to, rate) {
  var key = "h:" + from + "-" + to;
  var h = getJson_(key, []);
  var day = new Date().toISOString().slice(0, 10);
  if (rate && (!h.length || h[h.length - 1].d !== day)) {
    h.push({ d: day, r: Number(rate.toPrecision(6)) });
    while (h.length > HISTORY_DAYS) h.shift();
    setJson_(key, h);
  }
  return h;
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  var from = String(p.from || "").toUpperCase(), to = String(p.to || "").toUpperCase();
  if (SOURCES.indexOf(from) < 0 || DESTS.indexOf(to) < 0) return out_({ error: "corridor" });
  var m = market_();
  var rate = pair_(m, from, to);
  return out_({
    market: rate ? { rate: rate, at: m.at } : null,
    providers: getJson_("c:" + from + "-" + to, {}),
    history: history_(from, to, rate)
  });
}

function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out_({ error: "body" }); }
  if (body.website) return out_({ ok: true }); // honeypot field filled by a bot
  var from = String(body.from || "").toUpperCase(), to = String(body.to || "").toUpperCase();
  var provider = String(body.provider || "");
  var rate = Number(body.rate);
  if (SOURCES.indexOf(from) < 0 || DESTS.indexOf(to) < 0) return out_({ error: "corridor" });
  var list = allowed_()[COUNTRY[from]] || [];
  if (list.indexOf(provider) < 0) return out_({ error: "provider" });
  if (!isFinite(rate) || rate <= 0) return out_({ error: "rate" });
  var fee = body.fee === null || body.fee === undefined || body.fee === "" ? null : Number(body.fee);

  var m = market_();
  var mid = pair_(m, from, to);
  if (!mid) return out_({ error: "market" });
  if (Math.abs(rate / mid - 1) > MAX_DEVIATION) return out_({ error: "range", market: mid });
  if (fee !== null && (!isFinite(fee) || fee < 0 || fee / m.rates[from] > 60)) return out_({ error: "fee" });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var cache = CacheService.getScriptCache();
    var limitKey = "l:" + from + "-" + to + ":" + provider;
    if (cache.get(limitKey)) return out_({ error: "wait" });
    cache.put(limitKey, "1", LIMIT_SECONDS);

    var key = "c:" + from + "-" + to;
    var corridor = getJson_(key, {});
    var old = corridor[provider] || { n: 0 };
    corridor[provider] = {
      rate: Number(rate.toPrecision(7)),
      fee: fee === null ? (old.fee !== undefined ? old.fee : null) : Number(fee.toFixed(3)),
      at: Date.now(),
      n: (old.n || 0) + 1
    };
    setJson_(key, corridor);
  } finally {
    lock.releaseLock();
  }
  if (LOG_SHEET_ID) {
    try {
      var ss = SpreadsheetApp.openById(LOG_SHEET_ID);
      var sh = ss.getSheetByName("log") || ss.insertSheet("log");
      sh.appendRow([new Date(), from, to, provider, rate, fee, mid]);
    } catch (err) { /* logging is optional */ }
  }
  return out_({ ok: true, provider: corridor[provider] });
}

/** Run once from the editor to check the script works before deploying. */
function selfTest() {
  Logger.log(doGet({ parameter: { from: "SAR", to: "INR" } }).getContent());
}
