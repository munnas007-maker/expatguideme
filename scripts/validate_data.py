"""Check the hand- and robot-maintained data files before a build.

  python3 scripts/validate_data.py

Checks _src/data/telecom.json (SIM & internet page) and
_src/data/remit_providers.json (money transfer companies). Exits with an error
and a list of problems if anything is malformed, so a bad weekly update is
never published.
"""
import datetime
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "_src", "data")
CCS = ["sa", "ae", "qa", "kw", "om", "bh"]
CUR = {"sa": "SAR", "ae": "AED", "qa": "QAR", "kw": "KWD", "om": "OMR", "bh": "BHD"}
KINDS = {"prepaid", "postpaid", "data", "home", "esim"}
REMIT_TYPES = {"wallet", "bankRemit", "digitalBank", "global", "exchange"}
ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,29}$")


def is_https(u):
    return isinstance(u, str) and u.startswith("https://") and " " not in u


def is_time(t):
    if t is None:
        return True
    try:
        datetime.datetime.fromisoformat(str(t).replace("Z", "+00:00"))
        return True
    except ValueError:
        return False


def check_telecom(errs):
    d = json.load(open(os.path.join(DATA, "telecom.json"), encoding="utf-8"))
    if not is_time(d.get("updated_at")):
        errs.append("telecom: updated_at is not an ISO time")
    countries = d.get("countries") or {}
    for cc in CCS:
        ops = countries.get(cc)
        if not isinstance(ops, list) or not ops:
            errs.append(f"telecom {cc}: no operators")
            continue
        seen = set()
        for op in ops:
            where = f"telecom {cc}/{op.get('id')}"
            if not ID_RE.match(str(op.get("id", ""))) or op["id"] in seen:
                errs.append(f"{where}: missing, bad or duplicate id")
            seen.add(op.get("id"))
            if not op.get("name"):
                errs.append(f"{where}: no name")
            for k in ("website", "offers_url"):
                if not is_https(op.get(k)):
                    errs.append(f"{where}: {k} must be an https link")
            if op.get("affiliate_url") is not None and not is_https(op["affiliate_url"]):
                errs.append(f"{where}: affiliate_url must be null or an https link")
            if not is_time(op.get("checked_at")):
                errs.append(f"{where}: checked_at is not an ISO time")
            if any(k not in KINDS for k in op.get("kinds", [])):
                errs.append(f"{where}: unknown kind in {op.get('kinds')}")
            offer = op.get("offer")
            if offer is not None and not (isinstance(offer, dict) and offer.get("text")):
                errs.append(f"{where}: offer must be null or {{text, url}}")
            plans = op.get("plans") or []
            if plans and not op.get("checked_at"):
                errs.append(f"{where}: has plans but no checked_at")
            for p in plans:
                pw = f"{where} plan {p.get('name')!r}"
                if not p.get("name"):
                    errs.append(f"{where}: plan without name")
                if not isinstance(p.get("price"), (int, float)) or p["price"] < 0:
                    errs.append(f"{pw}: price must be a number")
                if p.get("currency", CUR[cc]) not in CUR.values() and p.get("currency") not in ("USD",):
                    errs.append(f"{pw}: unexpected currency {p.get('currency')}")
                if p.get("kind") not in KINDS:
                    errs.append(f"{pw}: kind must be one of {sorted(KINDS)}")
                if not is_https(p.get("url")):
                    errs.append(f"{pw}: url (official source page) must be an https link")


def check_remit(errs):
    d = json.load(open(os.path.join(DATA, "remit_providers.json"), encoding="utf-8"))
    provs = d.get("providers") or {}
    for cc in CCS:
        lst = provs.get(cc)
        if not isinstance(lst, list) or not lst:
            errs.append(f"remit {cc}: no providers")
            continue
        seen = set()
        for p in lst:
            where = f"remit {cc}/{p.get('id')}"
            if not ID_RE.match(str(p.get("id", ""))) or p["id"] in seen:
                errs.append(f"{where}: missing, bad or duplicate id")
            seen.add(p.get("id"))
            if not p.get("name"):
                errs.append(f"{where}: no name")
            if p.get("type") not in REMIT_TYPES:
                errs.append(f"{where}: type must be one of {sorted(REMIT_TYPES)}")
            if not is_https(p.get("url")):
                errs.append(f"{where}: url must be an https link")
            offer = p.get("offer")
            if offer is not None and not (isinstance(offer, dict) and offer.get("text") and is_time(offer.get("checked_at"))):
                errs.append(f"{where}: offer must be null or {{text, url, checked_at}}")


def main():
    errs = []
    check_telecom(errs)
    check_remit(errs)
    if errs:
        print("DATA PROBLEMS:")
        for e in errs:
            print(" -", e)
        sys.exit(1)
    print("data files OK")


if __name__ == "__main__":
    main()
