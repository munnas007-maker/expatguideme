"""One-off probe: download other websites' Saudi exchange-house rate pages, robots.txt and terms, for review."""
import os, urllib.request
os.makedirs("probe", exist_ok=True)
H = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"}
URLS = {
 "arablocal_rates.html": "https://arablocal.com/exchange-rates",
 "arablocal_robots.txt": "https://arablocal.com/robots.txt",
 "arablocal_terms.html": "https://arablocal.com/terms",
 "iisa_rates.html": "https://indianinsaudiarabia.com/sar-to-inr/",
 "iisa_robots.txt": "https://indianinsaudiarabia.com/robots.txt",
 "iisa_terms.html": "https://indianinsaudiarabia.com/terms/",
 "ksax_rates.html": "https://ksaexpats.com/exchange-rate/",
 "ksax_robots.txt": "https://ksaexpats.com/robots.txt",
}
for f, u in URLS.items():
    try:
        with urllib.request.urlopen(urllib.request.Request(u, headers=H), timeout=40) as r:
            open("probe/" + f, "wb").write(r.read()); print(f, r.status)
    except Exception as e:
        open("probe/" + f + ".err", "w").write(repr(e)); print(f, "ERR", e)
