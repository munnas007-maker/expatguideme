#!/usr/bin/env python3
"""
ExpatGuideME page builder.

Every page shares the same <head>, header, footer, floating buttons,
cookie banner and search dialog. This script writes them into each page
so they never drift apart.

Usage (from the repository root):
    python3 _src/build.py

Edit the page bodies in _src/pages/*.html, then run the script.
The generated .html files in site/ are what Netlify serves.
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_src", "pages")
SITE_URL = "https://expatguideme.com"

# Google AdSense
ADSENSE_CLIENT = "ca-pub-4815162342890123"
# Ad unit ID of a responsive display unit created in AdSense (Ads > By ad unit).
# While it is empty, reserved spaces stay hidden and Auto ads place ads instead.
ADSENSE_UNIT = ""
# Pages that never show ads (policy and trust pages).
NO_AD_PAGES = {"about", "privacy", "terms", "affiliate", "contact", "404", "notfound", "none"}

ICON = {
    "search": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    "moon": '<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    "sun": '<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    "menu": '<svg class="i-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    "close": '<svg class="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    "globe": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    "up": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    "mail": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    "copy": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
}

THEME_BOOT = (
    "<script>(function(){try{var t=localStorage.getItem('expatguideme_theme');"
    "if(t!=='dark'&&t!=='light'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}"
    "document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>"
)


def head(meta):
    canonical = SITE_URL + meta["path"]
    robots = '\n  <meta name="robots" content="noindex">' if meta.get("noindex") else ""
    ads = ""
    if ADSENSE_CLIENT:
        ads = f'\n  <meta name="google-adsense-account" content="{ADSENSE_CLIENT}">'
        if meta["active"] not in NO_AD_PAGES:
            ads += f'\n  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={ADSENSE_CLIENT}" crossorigin="anonymous"></script>'
    return f"""<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{meta["title"]}</title>
  <meta name="description" content="{meta["description"]}">{robots}{ads}
  <link rel="canonical" href="{canonical}">
  <meta name="theme-color" content="#ffffff">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  {THEME_BOOT}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Cairo:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Malayalam:wght@400;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/site.css">
{meta.get("style", "")}
</head>"""


def header(active):
    def link(href, key, name):
        cur = ' aria-current="page"' if active == name else ""
        return f'<a href="{href}" data-s="{key}"{cur}></a>'

    ads_mode = ("live" if ADSENSE_UNIT else "auto") if ADSENSE_CLIENT and active not in NO_AD_PAGES else "off"
    return f"""<body data-page="{active}" data-ads="{ads_mode}">
  <a class="skip-link" href="#main" data-s="skip">Skip to content</a>
  <div class="scroll-progress" aria-hidden="true"><span id="scrollProgress"></span></div>

  <header class="site-header">
    <div class="wrap header-row">
      <a class="logo" href="/">ExpatGuide<span>ME</span></a>
      <nav class="site-nav" id="siteNav" aria-label="Main">
        {link("/", "navHome", "home")}
        {link("/exchange-rate.html", "navExchange", "exchange")}
        {link("/send-money.html", "navSend", "send")}
        {link("/contact.html", "navContact", "contact")}
      </nav>
      <div class="header-actions">
        <div class="lang-menu">
          <button type="button" class="icon-btn" id="langToggle" aria-haspopup="true" aria-expanded="false" aria-controls="langList" data-s-aria="language">
            {ICON["globe"]}<span class="lang-current" id="langCurrent">English</span>
          </button>
          <div class="langs" id="langList" role="group" hidden>
            <button type="button" data-lang="en" lang="en">English</button>
            <button type="button" data-lang="ar" lang="ar">العربية</button>
            <button type="button" data-lang="hi" lang="hi">हिन्दी</button>
            <button type="button" data-lang="ml" lang="ml">മലയാളം</button>
            <button type="button" data-lang="ne" lang="ne">नेपाली</button>
            <button type="button" data-lang="ur" lang="ur">اردو</button>
          </div>
        </div>
        <button type="button" class="icon-btn" data-open-search data-s-aria="search">{ICON["search"]}</button>
        <button type="button" class="icon-btn" id="themeToggle">{ICON["moon"]}{ICON["sun"]}</button>
        <button type="button" class="icon-btn menu-btn" id="menuToggle" aria-controls="siteNav" aria-expanded="false">{ICON["menu"]}{ICON["close"]}</button>
      </div>
    </div>
  </header>
"""


def _exists(href):
    name = "index.html" if href == "/" else href.lstrip("/")
    return os.path.exists(os.path.join(SRC, name))


def _links(items):
    return "\n".join(
        f'            <a href="{h}" data-s="{k}"></a>' for h, k in items if _exists(h)
    )


def footer(credit):
    credit_html = (
        '\n      <p class="credit"><a href="https://www.exchangerate-api.com">Rates By Exchange Rate API</a></p>'
        if credit else ""
    )
    return f"""
  <footer class="site-footer">
    <div class="wrap">
      <section class="newsletter" aria-labelledby="nlTitle">
        <h2 id="nlTitle" data-s="nlTitle"></h2>
        <p data-s="nlText"></p>
        <form class="nl-form" name="newsletter" method="POST" action="/" data-netlify="true" netlify-honeypot="bot-field" data-ajax data-success="nlSuccess" novalidate>
          <input type="hidden" name="form-name" value="newsletter">
          <p class="hp"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
          <label class="sr-only" for="nlEmail" data-s="nlEmail"></label>
          <input id="nlEmail" type="email" name="email" required autocomplete="email" inputmode="email" data-s-ph="nlEmail">
          <button type="submit" class="btn btn-primary" data-s="nlButton"></button>
          <p class="form-msg" role="alert" aria-live="polite"></p>
        </form>
        <div class="success-box" id="nlSuccess" tabindex="-1" role="status" hidden>
          <span class="check" aria-hidden="true">✓</span><span data-s="nlSuccess"></span>
        </div>
      </section>
      <div class="footer-cols">
        <div>
          <h3 data-s="footerTools"></h3>
          <nav class="footer-links" aria-label="Tools">
{_links([("/exchange-rate.html", "navExchange"), ("/send-money.html", "navSend"), ("/end-of-service.html", "navEos"), ("/id-residency.html", "navId"), ("/family-cost.html", "navFamily"), ("/embassy-services.html", "navEmbassy")])}
          </nav>
        </div>
        <div>
          <h3 data-s="footerSite"></h3>
          <nav class="footer-links" aria-label="Footer">
{_links([("/", "navHome"), ("/about.html", "navAbout"), ("/contact.html", "navContact"), ("/privacy.html", "navPrivacy"), ("/terms.html", "navTerms"), ("/affiliate-disclosure.html", "navAffiliate")])}
          </nav>
        </div>
      </div>
      <p class="disclaimer" data-s="disclaimer"></p>{credit_html}
    </div>
  </footer>

  <a class="fab-contact" href="/contact.html">{ICON["mail"]}<span data-s="contactUs"></span></a>
  <button type="button" class="to-top" id="toTop" data-s-aria="toTop" hidden>{ICON["up"]}</button>

  <div class="cookie-banner" id="cookieBanner" role="region" aria-label="Cookies" hidden>
    <p data-s="cookieText"></p>
    <a href="/privacy.html" data-s="cookieLearn"></a>
    <button type="button" class="btn btn-primary" id="cookieOk" data-s="cookieOk"></button>
  </div>

  <div class="search-overlay" id="searchOverlay" role="dialog" aria-modal="true" aria-labelledby="searchTitle" hidden>
    <div class="search-box">
      <div class="search-head">
        {ICON["search"]}
        <h2 id="searchTitle" class="sr-only" data-s="search"></h2>
        <label class="sr-only" for="searchInput" data-s="search"></label>
        <input type="search" id="searchInput" autocomplete="off" data-s-ph="searchPh">
        <button type="button" class="icon-btn" id="searchClose" data-s-aria="close">{ICON["close"].replace(' class="i-close"', '')}</button>
      </div>
      <ul class="search-results" id="searchResults"></ul>
    </div>
  </div>
"""


def parse_page(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    m = re.match(r"\s*<!--META\n(.*?)\nMETA-->\n", text, re.S)
    if not m:
        raise SystemExit(f"{path}: missing META block")
    meta = {}
    for line in m.group(1).splitlines():
        if not line.strip():
            continue
        key, _, value = line.partition(":")
        meta[key.strip()] = value.strip()
    rest = text[m.end():]

    def section(name):
        sm = re.search(rf"<!--{name}-->\n(.*?)<!--/{name}-->", rest, re.S)
        return sm.group(1) if sm else ""

    meta["style"] = section("STYLE")
    meta["noindex"] = meta.get("noindex") == "yes"
    return meta, section("BODY"), section("SCRIPT")


AD_SLOT_RE = re.compile(r'<div class="ad-slot" data-ad-slot="([a-z0-9-]+)" data-t="ad"></div>')


def ad_units(body, active):
    """Turn reserved ad spaces into AdSense units (or hide them)."""
    if not ADSENSE_CLIENT or active in NO_AD_PAGES:
        return AD_SLOT_RE.sub("", body)
    if not ADSENSE_UNIT:
        return body
    return AD_SLOT_RE.sub(
        lambda m: (
            f'<div class="ad-slot ad-live" data-ad-slot="{m.group(1)}">'
            '<span class="ad-label" data-s="ad"></span>'
            f'<ins class="adsbygoogle" style="display:block" data-ad-client="{ADSENSE_CLIENT}" '
            f'data-ad-slot="{ADSENSE_UNIT}" data-ad-format="auto" data-full-width-responsive="true"></ins>'
            "<script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div>"
        ),
        body,
    )


def build():
    pages = sorted(p for p in os.listdir(SRC) if p.endswith(".html"))
    for name in pages:
        meta, body, script = parse_page(os.path.join(SRC, name))
        html = (
            head(meta)
            + "\n"
            + header(meta["active"])
            + "\n"
            + ad_units(body, meta["active"]).rstrip()
            + "\n"
            + footer(meta.get("credit") == "yes")
            + '\n  <script src="/assets/site.js"></script>\n'
            + (script.rstrip() + "\n" if script.strip() else "")
            + "</body>\n</html>\n"
        )
        out = os.path.join(ROOT, "site", name)
        with open(out, "w", encoding="utf-8") as f:
            f.write(html)
        print("built", name)
    if ADSENSE_CLIENT:
        pub = ADSENSE_CLIENT.replace("ca-", "")
        with open(os.path.join(ROOT, "site", "ads.txt"), "w", encoding="utf-8") as f:
            f.write(f"google.com, {pub}, DIRECT, f08c47fec0942fa0\n")
        print("built ads.txt")


if __name__ == "__main__":
    build()
