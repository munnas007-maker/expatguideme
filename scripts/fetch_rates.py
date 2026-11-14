"""Fetch live exchange rates and the gold spot price from CurrencyFreaks in ONE call,
compute every Gulf cross-rate and per-gram gold price, and save data/live_rates.json.

    CURRENCYFREAKS_API_KEY=... python3 scripts/fetch_rates.py

The API key is read from the environment (GitHub secret CURRENCYFREAKS_API_KEY).
For local runs it may also be put in a .env file (KEY=value lines) in the repo root;
.env is listed in .gitignore and must never be committed.

If the key is missing, the call fails, or any value fails a check, the script exits
with a non-zero status and does NOT touch data/live_rates.json, so verified rates are
never replaced with guesses. The site robot then falls back to the free source.
"""
import datetime
import json
import os
import sys
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "live_rates.json")
API = "https://api.currencyfreaks.com/v2.0/rates/latest"
GCC = ["SAR", "AED", "QAR", "KWD", "OMR", "BHD"]
DEST = ["INR", "PKR", "BDT", "PHP", "NPR", "EGP"]
EXTRA = ["LKR", "IDR", "EUR", "GBP"]   # other currencies shown on the exchange-rate page, same single call
SYMBOLS = GCC + DEST + EXTRA + ["XAU"]
GRAMS_PER_TROY_OZ = 31.1035
KARATS = {"24K": 24, "22K": 22, "21K": 21, "18K": 18}
# Official pegs (tolerance) — a feed that disagrees is rejected, never published
PEGS = {"SAR": (3.75, 0.02), "AED": (3.6725, 0.02), "QAR": (3.64, 0.03), "BHD": (0.376, 0.003), "OMR": (0.3845, 0.003)}
# Plausible ranges per 1 USD, to catch broken or shifted data
RANGES = {"LKR": (150, 450), "IDR": (10000, 25000), "EUR": (0.6, 1.3), "GBP": (0.5, 1.1), "KWD": (0.25, 0.36), "INR": (60, 140), "PKR": (150, 450), "BDT": (80, 180), "PHP": (40, 80), "NPR": (100, 220), "EGP": (20, 90)}


def api_key():
    key = os.environ.get("CURRENCYFREAKS_API_KEY", "").strip()
    if not key:
        env = os.path.join(ROOT, ".env")
        if os.path.exists(env):
            for line in open(env, encoding="utf-8"):
                k, _, v = line.strip().partition("=")
                if k.strip() == "CURRENCYFREAKS_API_KEY":
                    key = v.strip().strip('"').strip("'")
    return key


def fail(msg):
    print("fetch_rates: " + msg, file=sys.stderr)
    sys.exit(1)


def fetch(key):
    url = API + "?" + urllib.parse.urlencode({"apikey": key, "symbols": ",".join(SYMBOLS)})
    req = urllib.request.Request(url, headers={"User-Agent": "ExpatGuideME-rates", "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read().decode("utf-8"))
    except Exception as e:  # never print the URL: it contains the key
        fail("request failed (" + type(e).__name__ + ")")


def parse(data):
    if not isinstance(data, dict) or data.get("base") != "USD" or not isinstance(data.get("rates"), dict):
        fail("unexpected response (expected base USD with a rates object)")
    try:
        when = datetime.datetime.strptime(str(data["date"]).strip() + "00", "%Y-%m-%d %H:%M:%S%z")
    except (KeyError, ValueError):
        fail("missing or unreadable date: %r" % data.get("date"))
    now = datetime.datetime.now(datetime.timezone.utc)
    if when > now + datetime.timedelta(minutes=10) or now - when > datetime.timedelta(days=3):
        fail("date %s is not current" % when.isoformat())
    usd = {}
    for c in SYMBOLS:
        try:
            v = float(data["rates"][c])
        except (KeyError, TypeError, ValueError):
            fail("missing or non-numeric rate for " + c)
        if not v > 0:
            fail("rate for %s must be positive" % c)
        usd[c] = v
    for c, (peg, tol) in PEGS.items():
        if abs(usd[c] - peg) > tol:
            fail("%s = %s is far from its official peg %s" % (c, usd[c], peg))
    for c, (lo, hi) in RANGES.items():
        if not lo <= usd[c] <= hi:
            fail("%s = %s is outside the plausible range %s-%s" % (c, usd[c], lo, hi))
    oz = 1 / usd.pop("XAU")
    if not 500 < oz < 20000:
        fail("gold price %.2f USD/oz is implausible" % oz)
    return when, usd, oz


def compute(when, usd, oz):
    cross = {g: {d: round(usd[d] / usd[g], 4) for d in DEST} for g in GCC}
    gram_usd = oz / GRAMS_PER_TROY_OZ
    gold = {g: {k: round(gram_usd * (kt / 24) * usd[g], 2) for k, kt in KARATS.items()} for g in GCC}
    return {
        "source": "currencyfreaks.com",
        "api_date": when.strftime("%Y-%m-%d %H:%M:%S+00"),
        "updated_at": when.astimezone(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "updated_unix": int(when.timestamp()),
        "fetched_at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "base": "USD",
        "usd_rates": usd,
        "cross_rates": cross,
        "gold": {
            "usd_per_troy_ounce": round(oz, 2),
            "grams_per_troy_ounce": GRAMS_PER_TROY_OZ,
            "usd_per_gram_24k": round(gram_usd, 4),
            "per_gram": gold,
        },
    }


def main():
    key = api_key()
    if not key:
        fail("CURRENCYFREAKS_API_KEY is not set (GitHub secret or local .env)")
    when, usd, oz = parse(fetch(key))
    out = compute(when, usd, oz)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    tmp = OUT + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
        f.write("\n")
    os.replace(tmp, OUT)
    print("saved", OUT, "date", out["api_date"], "gold USD/oz", out["gold"]["usd_per_troy_ounce"],
          "SAR->INR", out["cross_rates"]["SAR"]["INR"])


if __name__ == "__main__":
    main()
