#!/usr/bin/env python3
"""Fetch the latest exchange rates and gold price into _src/data/rates.json, and
refresh the provider rates checked in each provider's own app
(_src/data/provider_rates.json).

Used by the GitHub Actions robot (.github/workflows/update-rates.yml, every
2 hours) before it rebuilds the site. Rates come from open.er-api.com (USD base),
the same free source the live pages use. Gold spot comes from api.gold-api.com
(free, no key). If the currency fetch fails, the old file is kept and the
script exits with an error so nothing half-updated is built. If only the gold
fetch fails, the previous gold price is kept and the rates still update.

Provider rates are never estimated or invented. They come only from rates a
person checked in the provider's app: either typed into provider_rates.json,
or (when "provider_rates_csv" in _src/data/site.json holds the link of a
published Google Sheet) read from that sheet. Each row must name a known
provider for the sending country, sit within 5% of the market rate, and be
less than 48 hours old; anything else is dropped and reported in the log.
"""
import csv
import datetime
import io
import re
import urllib.parse
import json
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "_src", "data", "rates.json")
PROVIDER_OUT = os.path.join(ROOT, "_src", "data", "provider_rates.json")
SITE_CFG = os.path.join(ROOT, "_src", "data", "site.json")
PROVIDERS_FILE = os.path.join(ROOT, "_src", "data", "remit_providers.json")
CUR_COUNTRY = {"SAR": "sa", "AED": "ae", "QAR": "qa", "KWD": "kw", "OMR": "om", "BHD": "bh"}
MAX_AGE_HOURS = 48
MAX_GAP = 0.05          # a checked rate must be within 5% of the market rate
RIYADH = datetime.timezone(datetime.timedelta(hours=3))
TROY_OUNCE_GRAMS = 31.1034768
CODES = ["SAR", "AED", "KWD", "QAR", "OMR", "BHD", "INR", "PKR", "BDT", "PHP", "NPR", "LKR", "IDR", "EGP", "USD"]


def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "ExpatGuideME-rates"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


CF_URL = "https://api.currencyfreaks.com/v2.0/rates/latest"
# Currencies the site uses (Gulf, home countries of expats, major world currencies). Crypto is ignored.
KEEP = set(CODES) | set("""EUR GBP ETB KES UGX SDG YER JOD MAD TND CNY MYR THB MMK AFN NGN GHS TRY CAD AUD
JPY CHF SGD HKD ZAR KRW LBP SYP IQD IRR VND TZS NZD""".split())
METALS = {"XAU", "XAG", "XPT", "XPD"}
# Official pegs, used only to sanity-check a feed before it is published
PEGS = {"SAR": (3.75, 0.02), "AED": (3.6725, 0.02), "QAR": (3.64, 0.03), "BHD": (0.376, 0.003), "OMR": (0.3845, 0.003)}


def check_rates(rates, source):
    for c in CODES:
        v = rates.get(c)
        if not isinstance(v, (int, float)) or v <= 0:
            raise ValueError(f"{source}: missing or bad rate for {c}: {v}")
    for c, (peg, tol) in PEGS.items():
        if abs(rates[c] - peg) > tol:
            raise ValueError(f"{source}: {c} rate {rates[c]} is far from its official peg {peg}")


def fetch_gold(previous):
    try:
        g = get_json("https://api.gold-api.com/price/XAU")
        oz = float(g["price"])
        if not 500 < oz < 20000:
            raise ValueError(f"gold price out of range: {oz}")
        return {
            "source": "api.gold-api.com",
            "usd_per_troy_ounce": round(oz, 2),
            "usd_per_gram_24k": round(oz / TROY_OUNCE_GRAMS, 4),
            "updated_at": g.get("updatedAt", ""),
        }
    except Exception as e:  # keep yesterday's gold price rather than failing the whole update
        print("gold fetch failed, keeping previous value:", e)
        return previous


def known_providers():
    """Provider ids per sending country, from _src/data/remit_providers.json."""
    with open(PROVIDERS_FILE, encoding="utf-8") as f:
        return {cc: {p["id"] for p in lst} for cc, lst in json.load(f)["providers"].items()}


def parse_time(text):
    """ISO time, or 'YYYY-MM-DD HH:MM' typed in a sheet (read as Riyadh time)."""
    t = (text or "").strip().replace("Z", "+00:00")
    if not t:
        return None
    for fmt in (None, "%Y-%m-%d %H:%M", "%Y-%m-%d %H:%M:%S", "%d/%m/%Y %H:%M", "%d/%m/%Y %H:%M:%S"):
        try:
            d = datetime.datetime.fromisoformat(t) if fmt is None else datetime.datetime.strptime(t, fmt)
        except ValueError:
            continue
        if d.tzinfo is None:
            d = d.replace(tzinfo=RIYADH)
        return d.astimezone(datetime.timezone.utc)
    return None


def clean_provider_rates(entries, usd_rates, now):
    """entries: list of dicts with from, to, provider, rate, fee, checked_at.
    Returns {"SAR-INR": {"stcbank": {...}}} keeping the newest valid row per provider."""
    providers = known_providers()
    out, dropped = {}, []
    for e in entries:
        fc, tc, pid = str(e.get("from", "")).strip().upper(), str(e.get("to", "")).strip().upper(), str(e.get("provider", "")).strip().lower()
        why = None
        try:
            rate = float(str(e.get("rate", "")).replace(",", ""))
        except ValueError:
            rate, why = None, "rate is not a number"
        fee_raw = str(e.get("fee", "") if e.get("fee") is not None else "").replace(",", "").strip()
        fee = None
        if fee_raw:
            try:
                fee = float(fee_raw)
                if fee < 0:
                    why = "negative fee"
            except ValueError:
                why = "fee is not a number"
        when = parse_time(str(e.get("checked_at", "")))
        if why:
            pass
        elif fc not in CUR_COUNTRY or tc not in usd_rates or fc == tc:
            why = "unknown route"
        elif pid not in providers.get(CUR_COUNTRY[fc], set()):
            why = "unknown provider for this country"
        elif not when:
            why = "missing or unreadable checked_at time"
        elif when > now + datetime.timedelta(minutes=10):
            why = "checked_at is in the future"
        elif now - when > datetime.timedelta(hours=MAX_AGE_HOURS):
            why = f"older than {MAX_AGE_HOURS} hours"
        else:
            market = usd_rates[tc] / usd_rates[fc]
            if not rate or abs(rate / market - 1) > MAX_GAP:
                why = f"rate {rate} is more than {int(MAX_GAP * 100)}% away from the market rate {market:.4f}"
        if why:
            dropped.append(f"{fc}-{tc} {pid}: {why}")
            continue
        route = out.setdefault(f"{fc}-{tc}", {})
        iso = when.strftime("%Y-%m-%dT%H:%M:%SZ")
        if pid not in route or route[pid]["checked_at"] < iso:
            route[pid] = {"rate": rate, "fee": fee, "checked_at": iso}
    for d in dropped:
        print("provider rate dropped:", d)
    return out


def update_provider_rates(usd_rates):
    now = datetime.datetime.now(datetime.timezone.utc)
    current = {"rates": {}}
    if os.path.exists(PROVIDER_OUT):
        with open(PROVIDER_OUT, encoding="utf-8") as f:
            current = json.load(f)
    entries = [dict(v, **{"from": r.split("-")[0], "to": r.split("-")[1], "provider": pid})
               for r, provs in (current.get("rates") or {}).items() for pid, v in provs.items()]
    csv_url = ""
    if os.path.exists(SITE_CFG):
        with open(SITE_CFG, encoding="utf-8") as f:
            csv_url = (json.load(f).get("provider_rates_csv") or "").strip()
    if csv_url:
        try:
            req = urllib.request.Request(csv_url, headers={"User-Agent": "ExpatGuideME-rates"})
            with urllib.request.urlopen(req, timeout=30) as r:
                text = r.read().decode("utf-8-sig")
            rows = [{(k or "").strip().lower(): (v or "").strip() for k, v in row.items()} for row in csv.DictReader(io.StringIO(text))]
            entries = rows  # the sheet is the source of truth when it is set up
            print("provider sheet rows:", len(rows))
        except Exception as e:
            print("provider sheet not reachable, keeping the previous checked rates:", e)
    current["rates"] = clean_provider_rates(entries, usd_rates, now)
    current["max_age_hours"] = MAX_AGE_HOURS
    with open(PROVIDER_OUT, "w", encoding="utf-8") as f:
        json.dump(current, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print("checked provider rates kept:", sum(len(v) for v in current["rates"].values()))


HISTORY = os.path.join(ROOT, "_src", "data", "history.json")
HIST_CODES = ["SAR", "AED", "QAR", "KWD", "OMR", "BHD", "INR", "PKR", "BDT", "PHP", "NPR", "LKR", "IDR", "EGP", "EUR", "GBP"]
HIST_DAYS = 90


def record_history(out):
    """Append this run's reading (time, gold USD/oz, USD rates) for the trend charts.
    Readings are stored as published; one per source update, kept for 90 days."""
    h = {"points": []}
    if os.path.exists(HISTORY):
        with open(HISTORY, encoding="utf-8") as f:
            h = json.load(f)
    pts = h.get("points", [])
    g = out.get("gold") or {}
    point = {"t": out["time_last_update_unix"], "g": g.get("usd_per_troy_ounce"),
             "gt": g.get("updated_at"), "r": {c: out["rates"][c] for c in HIST_CODES if c in out["rates"]}}
    if not pts or pts[-1].get("gt") != point["gt"] or pts[-1].get("t") != point["t"]:
        pts.append(point)
    cutoff = int(datetime.datetime.now(datetime.timezone.utc).timestamp()) - HIST_DAYS * 86400
    h["points"] = [p for p in pts if (p.get("t") or 0) >= cutoff or (p.get("gt") or "") >= datetime.datetime.fromtimestamp(cutoff, datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")]
    with open(HISTORY, "w", encoding="utf-8") as f:
        json.dump(h, f, separators=(",", ":"))
        f.write("\n")


def main():
    previous = {}
    if os.path.exists(OUT):
        with open(OUT, encoding="utf-8") as f:
            previous = json.load(f)
    rates = unix = gold = None
    source = None
    # Single source of truth: data/live_rates.json written by scripts/fetch_rates.py in this same run
    live_path = os.path.join(ROOT, "data", "live_rates.json")
    if os.path.exists(live_path):
        try:
            with open(live_path, encoding="utf-8") as f:
                live = json.load(f)
            fetched = datetime.datetime.fromisoformat(live["fetched_at"].replace("Z", "+00:00"))
            if datetime.datetime.now(datetime.timezone.utc) - fetched < datetime.timedelta(minutes=45):
                rates = dict(live["usd_rates"], USD=1.0)
                check_rates(rates, "data/live_rates.json")
                unix, source = live["updated_unix"], live["source"]
                g = live["gold"]
                gold = {"usd_per_troy_ounce": g["usd_per_troy_ounce"], "usd_per_gram_24k": g["usd_per_gram_24k"],
                        "updated_at": live["updated_at"], "source": live["source"]}
            else:
                print("data/live_rates.json is older than this run; using the fallback source")
        except Exception as e:
            rates = unix = gold = None
            print("data/live_rates.json not usable, falling back:", e)
    if rates is None:
        data = get_json("https://open.er-api.com/v6/latest/USD")
        if data.get("result") != "success":
            sys.exit("rate source did not return success")
        rates = {k: v for k, v in data["rates"].items() if k in KEEP and isinstance(v, (int, float)) and v > 0}
        try:
            check_rates(rates, "open.er-api.com")
        except ValueError as e:
            sys.exit(str(e))
        unix, source = data["time_last_update_unix"], "open.er-api.com"
    if gold is None:
        gold = fetch_gold(previous.get("gold"))
    out = {
        "source": source,
        "base": "USD",
        "time_last_update_unix": unix,
        "time_last_update_utc": datetime.datetime.fromtimestamp(unix, datetime.timezone.utc).strftime("%a, %d %b %Y %H:%M:%S +0000"),
        "rates": dict(sorted(rates.items())),
        "gold": gold,
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
        f.write("\n")
    print("saved", OUT, out["time_last_update_utc"], "gold:", (out["gold"] or {}).get("usd_per_troy_ounce"))
    update_provider_rates(rates)
    record_history(out)


if __name__ == "__main__":
    main()
