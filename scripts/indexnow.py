#!/usr/bin/env python3
"""Ping IndexNow (Bing, ChatGPT Search, Yandex, Seznam, Naver) with pages that changed.

Run by .github/workflows/daily-update.yml after GitHub Pages has deployed.
Sends every sitemap URL whose <lastmod> is today (UTC). With --all, sends
every URL in the sitemap (useful once after moving hosts).
"""
import datetime
import json
import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, "site")
HOST = "expatguideme.com"


def main():
    keys = [f[:-4] for f in os.listdir(SITE) if re.fullmatch(r"[0-9a-f]{32}\.txt", f)]
    if not keys:
        sys.exit("no IndexNow key file in site/")
    key = keys[0]
    with open(os.path.join(SITE, "sitemap.xml"), encoding="utf-8") as f:
        xml = f.read()
    today = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
    pairs = re.findall(r"<loc>([^<]+)</loc>\s*<lastmod>([^<]+)</lastmod>", xml)
    urls = [u for u, d in pairs] if "--all" in sys.argv else [u for u, d in pairs if d >= today]
    if not urls:
        print("IndexNow: nothing changed today, no ping sent")
        return
    body = json.dumps({"host": HOST, "key": key, "keyLocation": f"https://{HOST}/{key}.txt", "urlList": urls[:10000]}).encode()
    req = urllib.request.Request("https://api.indexnow.org/indexnow", data=body,
                                 headers={"Content-Type": "application/json; charset=utf-8"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print("IndexNow", r.status, "for", len(urls), "urls")
    except urllib.error.HTTPError as e:
        # 202 = accepted, 422/403 = key not verified yet; never fail the deploy over a ping
        print("IndexNow returned", e.code, e.read()[:200])


if __name__ == "__main__":
    main()
