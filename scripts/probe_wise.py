"""One-off probe: does Wise's public comparison API cover sending from SAR (and other Gulf currencies)?
Saves raw answers into probe/ for review. Not used by the site."""
import json, os, urllib.request, urllib.error
os.makedirs("probe", exist_ok=True)
H = {"User-Agent": "Mozilla/5.0 (ExpatGuideME rate research)", "Accept": "application/json"}
out = {}
def get(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=H), timeout=30) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")[:2000]
    except Exception as e:
        return 0, repr(e)
for src in ["SAR", "AED", "QAR", "KWD", "OMR", "BHD"]:
    for dst in ["INR", "PKR", "BDT", "PHP", "NPR", "EGP"]:
        for base in ["https://api.wise.com/v4/comparisons/", "https://api.transferwise.com/v4/comparisons/"]:
            url = f"{base}?sourceCurrency={src}&targetCurrency={dst}&sendAmount=1000"
            code, body = get(url)
            key = f"{src}-{dst}-{'wise' if 'wise.com' in base else 'tw'}"
            try:
                d = json.loads(body)
                provs = [{"name": p.get("name"), "alias": p.get("alias"), "type": p.get("type"),
                          "quotes": [{k: q.get(k) for k in ("rate", "fee", "receivedAmount", "dateCollected", "sourceCountry", "targetCountry")} for q in p.get("quotes", [])][:3]}
                         for p in d.get("providers", [])]
                out[key] = {"status": code, "providers": provs}
            except Exception:
                out[key] = {"status": code, "body": body[:600]}
            if code == 200:
                break
json.dump(out, open("probe/wise.json", "w"), indent=1, ensure_ascii=False)
print({k: (v["status"], len(v.get("providers", []))) for k, v in out.items()})
