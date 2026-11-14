#!/usr/bin/env python3
"""Fetch today's baseline exchange rates and save them to _src/data/rates.json.

Used by the daily GitHub Actions robot (.github/workflows/daily-update.yml)
before it rebuilds the site. Rates come from open.er-api.com (USD base),
the same free source the live pages use. If the fetch fails, the old file
is kept and the script exits with an error so nothing half-updated is built.
"""
import json
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "_src", "data", "rates.json")
CODES = ["SAR", "AED", "KWD", "QAR", "OMR", "BHD", "INR", "PKR", "BDT", "PHP", "NPR", "LKR", "IDR", "EGP", "USD"]


def main():
    req = urllib.request.Request("https://open.er-api.com/v6/latest/USD", headers={"User-Agent": "ExpatGuideME-daily-update"})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.load(r)
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
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
        f.write("\n")
    print("saved", OUT, out["time_last_update_utc"])


if __name__ == "__main__":
    main()
