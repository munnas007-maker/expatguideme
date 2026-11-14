#!/usr/bin/env python3
"""Fetch today's baseline exchange rates and save them to _src/data/rates.json.

Used by the daily GitHub Actions robot (.github/workflows/daily-update.yml)
before it rebuilds the site. Rates come from open.er-api.com (USD base),
the same free source the live pages use. Gold spot comes from api.gold-api.com
(free, no key). If the currency fetch fails, the old file is kept and the
script exits with an error so nothing half-updated is built. If only the gold
fetch fails, the previous gold price is kept and the rates still update.
"""
import json
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "_src", "data", "rates.json")
TROY_OUNCE_GRAMS = 31.1034768
CODES = ["SAR", "AED", "KWD", "QAR", "OMR", "BHD", "INR", "PKR", "BDT", "PHP", "NPR", "LKR", "IDR", "EGP", "USD"]


def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "ExpatGuideME-daily-update"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


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


def main():
    previous = {}
    if os.path.exists(OUT):
        with open(OUT, encoding="utf-8") as f:
            previous = json.load(f)
    data = get_json("https://open.er-api.com/v6/latest/USD")
    if data.get("result") != "success":
        sys.exit("rate source did not return success")
    rates = {c: data["rates"][c] for c in CODES}
    for c, v in rates.items():
        if not isinstance(v, (int, float)) or v <= 0:
            sys.exit(f"bad rate for {c}: {v}")
    out = {
        "source": "open.er-api.com",
        "base": "USD",
        "time_last_update_unix": data["time_last_update_unix"],
        "time_last_update_utc": data["time_last_update_utc"],
        "rates": rates,
        "gold": fetch_gold(previous.get("gold")),
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
        f.write("\n")
    print("saved", OUT, out["time_last_update_utc"], "gold:", (out["gold"] or {}).get("usd_per_troy_ounce"))


if __name__ == "__main__":
    main()
