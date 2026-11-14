"""One-off discovery robot: download the public pages of Gulf exchange houses and
remittance companies, so we can see which of them publish their rates on the web.
Saves raw HTML and every script/JSON URL that looks rate-related into probe/.
Run by .github/workflows/probe.yml (manual). Reads only public pages and respects robots.txt."""
import json, os, re, urllib.request, urllib.robotparser, urllib.parse

UA = "Mozilla/5.0 (compatible; ExpatGuideME-rates/1.0; +https://expatguideme.com/)"
CANDIDATES = {
  "ae": ["https://alansariexchange.com/", "https://luluexchange.com/", "https://luluexchange.com/currency-converter/aed-to-inr/",
         "https://www.gccexchange.com/", "https://www.joyalukkasexchange.com/", "https://www.alfardanexchange.com/",
         "https://www.wallstreet.ae/", "https://www.orientexchange.com/", "https://www.alrostamaniexchange.com/",
         "https://www.sharafexchange.ae/", "https://www.unimoni.ae/", "https://www.emiratesislamic.ae/"],
  "qa": ["https://www.alfardanexchange.com.qa/", "https://alzamanexchange.com/", "https://www.dohaexchange.com/",
         "https://www.luluexchange.com.qa/", "https://www.gulfexchange.com.qa/", "https://www.trustexchange.qa/",
         "https://www.aldarexchange.com/", "https://www.cityexchange.qa/", "https://www.almanaexchange.com/"],
  "kw": ["https://www.almullaexchange.com/", "https://www.bec.com.kw/", "https://www.muzaini.com/",
         "https://www.luluexchange.com.kw/", "https://www.dollarco.com/", "https://www.joyalukkasexchange.com.kw/",
         "https://www.cityexchange.com.kw/", "https://www.alsharqexchange.com/"],
  "om": ["https://www.luluexchange.com/om/", "https://www.purshottam.com/", "https://www.modernexchange.com/",
         "https://www.gulfoverseas.com/", "https://www.hamdanexchange.com/", "https://www.globalmoneyexchange.com/",
         "https://www.omanuae.com/", "https://www.unimoni.om/"],
  "bh": ["https://www.bfc.com.bh/", "https://www.bfc.com.bh/personal/international-money-transfer/",
         "https://www.luluexchange.com.bh/", "https://www.bahrainexchange.com/", "https://www.zenj.com/",
         "https://www.nec.com.bh/", "https://www.isabinyousif.com/", "https://www.cityexchange.com.bh/"],
  "sa": ["https://www.westernunion.com/sa/en/home.html", "https://www.enjaz.com.sa/", "https://www.tahweelalrajhi.com.sa/",
         "https://www.urpay.com.sa/", "https://www.stcbank.com.sa/", "https://www.barq.com/", "https://www.tiqmo.com/",
         "https://www.mobilypay.sa/", "https://www.bankaljazira.com/fawri", "https://www.alinma.com/", "https://www.d360.com/",
         "https://www.visionbank.com.sa/", "https://www.meem.com.sa/", "https://friendipay.com/", "https://www.binyalla.com/",
         "https://www.emiratesnbd.com.sa/", "https://www.neo.sa/"],
}
RATEY = re.compile(r"(rate|exchange|currency|convert|remit|fx|forex|price)", re.I)
OUT = "probe"


def allowed(url):
    p = urllib.parse.urlparse(url)
    rp = urllib.robotparser.RobotFileParser(f"{p.scheme}://{p.netloc}/robots.txt")
    try:
        rp.read()
        return rp.can_fetch(UA, url)
    except Exception:
        return True


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,application/json,*/*"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.status, r.geturl(), r.read(3_000_000).decode("utf-8", "replace")


def main():
    os.makedirs(OUT, exist_ok=True)
    report = []
    for cc, urls in CANDIDATES.items():
        for url in urls:
            row = {"cc": cc, "url": url}
            try:
                if not allowed(url):
                    row["status"] = "robots.txt disallows"
                    report.append(row); continue
                status, final, html = get(url)
                name = re.sub(r"[^a-z0-9]+", "_", urllib.parse.urlparse(final).netloc + urllib.parse.urlparse(final).path).strip("_")[:80]
                open(os.path.join(OUT, f"{cc}__{name}.html"), "w", encoding="utf-8").write(html)
                srcs = re.findall(r"""(?:src|href|fetch\(|url:)\s*=?\s*["']([^"']+)["']""", html)
                row.update(status=status, final=final, bytes=len(html),
                           ratey_urls=sorted({u for u in srcs if RATEY.search(u)})[:60],
                           mentions_inr=len(re.findall(r"\bINR\b", html)), mentions_rate=len(re.findall(r"(?i)exchange rate|today'?s rate|rates", html)),
                           last_updated=re.findall(r"(?i)last updated[^<]{0,60}", html)[:3])
            except Exception as e:
                row["status"] = f"error: {e}"
            report.append(row)
            print(json.dumps(row)[:300])
    json.dump(report, open(os.path.join(OUT, "report.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
