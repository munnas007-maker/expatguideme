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
import datetime
import json
import os
import shutil
import sys
import subprocess
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_src", "pages")
SITE_URL = "https://expatguideme.com"

# Languages. English lives at the root; every other language gets its own folder
# (/ar/, /hi/, /ml/, /ne/, /ur/, /bn/, /tl/) built by _src/prerender.cjs.
LANGS = ["en", "ar", "hi", "ml", "ne", "ur", "bn", "tl"]
HREFLANG = {"en": "en", "ar": "ar", "hi": "hi", "ml": "ml", "ne": "ne", "ur": "ur", "bn": "bn", "tl": "tl"}

# Google AdSense
ADSENSE_CLIENT = "ca-pub-4815162342890123"
# Ad unit ID of a responsive display unit created in AdSense (Ads > By ad unit).
# While it is empty, reserved spaces stay hidden and Auto ads place ads instead.
ADSENSE_UNIT = ""
# Pages that never show ads (policy and trust pages).
NO_AD_PAGES = {"app", "consult", "playbook", "about", "privacy", "terms", "affiliate", "contact", "404", "notfound", "none"}

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from icons import icon as lucide  # noqa: E402  Lucide icons (ISC)

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


def alternates(meta):
    """hreflang links for every language version of this page."""
    if meta.get("noindex"):
        return ""
    path = meta["path"]
    if meta.get("en_only"):
        return f'\n  <link rel="alternate" hreflang="en" href="{SITE_URL + path}">\n  <link rel="alternate" hreflang="x-default" href="{SITE_URL + path}">'
    out = []
    for l in LANGS:
        url = SITE_URL + (path if l == "en" else "/" + l + path)
        out.append(f'\n  <link rel="alternate" hreflang="{HREFLANG[l]}" href="{url}">')
    out.append(f'\n  <link rel="alternate" hreflang="x-default" href="{SITE_URL + path}">')
    return "".join(out)


FORM_TAG_RE = re.compile(r'<form ([^>]*?)method="POST" action="/"([^>]*)>')


def static_forms(html):
    """Point every form at FormSubmit so it also works without JavaScript, and add its hidden fields:
    _next (thank-you page), _subject, _template, _captcha and the _honey spam trap.
    With JavaScript on, site.js sends the same form as JSON to the AJAX endpoint instead."""
    ep = SITE_CFG.get("form_endpoint")
    if not ep:
        return html
    action = ep.replace("/ajax/", "/")

    def repl(m):
        attrs = m.group(1) + m.group(2)
        nm = re.search(r'name="([^"]+)"', attrs)
        name = nm.group(1) if nm else "form"
        hidden = (f'<input type="hidden" name="_next" value="{SITE_URL}/thank-you.html">'
                  f'<input type="hidden" name="_subject" value="ExpatGuideME {name}">'
                  '<input type="hidden" name="_template" value="table">'
                  '<input type="hidden" name="_captcha" value="false">'
                  '<input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="display:none">')
        return f'<form {m.group(1)}method="POST" action="{action}"{m.group(2)}>{hidden}'
    return FORM_TAG_RE.sub(repl, html)


def form_meta():
    ep = SITE_CFG.get("form_endpoint")
    return f'\n  <meta name="form-endpoint" content="{ep}">' if ep else ""


def head(meta):
    canonical = SITE_URL + meta["path"]
    robots = '\n  <meta name="robots" content="noindex">' if meta.get("noindex") else ""
    ads = ""
    if ADSENSE_CLIENT:
        ads = f'\n  <meta name="google-adsense-account" content="{ADSENSE_CLIENT}">'
        if meta["active"] not in NO_AD_PAGES:
            ads += f'\n  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={ADSENSE_CLIENT}" crossorigin="anonymous"></script>'
    return f"""<!DOCTYPE html>
<html lang="en" dir="ltr"{'' if meta.get("noindex") else ' data-page-lang="en"'}{' data-en-only' if meta.get("en_only") else ''}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{meta["title"]}</title>
  <meta name="description" content="{meta["description"]}">{robots}{ads}
  <link rel="canonical" href="{canonical}">{alternates(meta)}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ExpatGuideME">
  <meta property="og:title" content="{meta["title"]}">
  <meta property="og:description" content="{meta["description"]}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{SITE_URL}/assets/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="en_GB">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#ffffff">{form_meta()}
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <meta name="apple-mobile-web-app-title" content="ExpatGuideME">
  <meta name="mobile-web-app-capable" content="yes">
  {THEME_BOOT}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Cairo:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Malayalam:wght@400;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&family=Noto+Sans+Bengali:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/site.css">
{meta.get("style", "")}
</head>"""


def header(active):
    def link(href, key, name):
        cur = ' aria-current="page"' if active == name else ""
        return f'<a href="{href}" data-s="{key}"{cur}></a>'

    def bn(href, ic, key, name):
        cur = ' aria-current="page"' if active == name else ""
        return f'<a href="{href}"{cur}>{lucide(ic, "bn-ic")}<span data-s="{key}"></span></a>'

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
        <span class="nav-more" aria-hidden="false">
          {link("/gold-rate.html", "navGold", "gold")}
          {link("/sim-internet.html", "navSim", "sim")}
          {link("/family-visa.html", "navVisa", "visa")}
          {link("/end-of-service.html", "navEos", "eos")}
          {link("/vacation-calculator.html", "navVac", "vac")}
          {link("/family-cost.html", "navFamily", "family")}
          {link("/id-residency.html", "navId", "id")}
          {link("/embassy-services.html", "navEmbassy", "embassy")}
          <button type="button" class="nav-theme" data-theme-proxy><span data-s="themeLabel"></span></button>
        </span>
      </nav>
      <div class="header-actions">
        <div class="country-menu">
          <button type="button" class="icon-btn country-btn" id="countryToggle" aria-haspopup="true" aria-expanded="false" aria-controls="countryList" data-s-aria="countryPick"><span id="countryFlag" aria-hidden="true">🇸🇦</span></button>
          <div class="countries" id="countryList" role="group" hidden>
            <p class="countries-title" data-s="countryPick"></p>
            <button type="button" data-cc="sa"><span aria-hidden="true">🇸🇦</span> <span data-s="cSA"></span></button>
            <button type="button" data-cc="ae"><span aria-hidden="true">🇦🇪</span> <span data-s="cAE"></span></button>
            <button type="button" data-cc="qa"><span aria-hidden="true">🇶🇦</span> <span data-s="cQA"></span></button>
            <button type="button" data-cc="kw"><span aria-hidden="true">🇰🇼</span> <span data-s="cKW"></span></button>
            <button type="button" data-cc="om"><span aria-hidden="true">🇴🇲</span> <span data-s="cOM"></span></button>
            <button type="button" data-cc="bh"><span aria-hidden="true">🇧🇭</span> <span data-s="cBH"></span></button>
          </div>
        </div>
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
            <button type="button" data-lang="bn" lang="bn">বাংলা</button>
            <button type="button" data-lang="tl" lang="tl">Tagalog</button>
          </div>
        </div>
        <button type="button" class="icon-btn" data-open-search data-s-aria="search">{ICON["search"]}</button>
        <button type="button" class="icon-btn" id="themeToggle">{ICON["moon"]}{ICON["sun"]}</button>
        <button type="button" class="icon-btn menu-btn" id="menuToggle" aria-controls="siteNav" aria-expanded="false">{ICON["menu"]}{ICON["close"]}</button>
      </div>
    </div>
  </header>
  <nav class="bottom-nav" aria-label="Quick links">
    {bn("/", "home", "navHome", "home")}
    {bn("/exchange-rate.html", "exchange", "bnRates", "exchange")}
    {bn("/send-money.html", "send", "bnSend", "send")}
    {bn("/gold-rate.html", "gold", "bnGold", "gold")}
    <button type="button" data-open-menu aria-controls="siteNav">{lucide("grid", "bn-ic")}<span data-s="bnMore"></span></button>
  </nav>
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
        <form class="nl-form" name="newsletter" method="POST" action="/" data-ajax data-success="nlSuccess" novalidate>
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
{_links([("/exchange-rate.html", "navExchange"), ("/gold-rate.html", "navGold"), ("/send-money.html", "navSend"), ("/sim-internet.html", "navSim"), ("/family-visa.html", "navVisa"), ("/end-of-service.html", "navEos"), ("/vacation-calculator.html", "navVac"), ("/id-residency.html", "navId"), ("/family-cost.html", "navFamily"), ("/embassy-services.html", "navEmbassy")])}
          </nav>
        </div>
        <div>
          <h3 data-s="footerSite"></h3>
          <nav class="footer-links" aria-label="Footer">
{_links([("/", "navHome"), ("/legal-consult.html", "navConsult"), ("/financial-playbook.html", "navPlaybook"), ("/mobile-app.html", "navApp"), ("/about.html", "navAbout"), ("/contact.html", "navContact"), ("/privacy.html", "navPrivacy"), ("/terms.html", "navTerms"), ("/affiliate-disclosure.html", "navAffiliate")])}
          </nav>
        </div>
      </div>
{ESSENTIALS}
      <div class="footer-app">
        <h3 data-s="appGet"></h3>
        <div class="store-pills">
          <a class="store-pill" href="/mobile-app.html" data-store="android"><span class="store-ico" aria-hidden="true">📱</span><span data-s="appSoonAndroid"></span></a>
          <a class="store-pill" href="/mobile-app.html" data-store="ios"><span class="store-ico" aria-hidden="true">📱</span><span data-s="appSoonIos"></span></a>
          <button type="button" class="store-pill store-install" data-install hidden><span class="store-ico" aria-hidden="true">⬇</span><span data-s="appInstallBtn"></span></button>
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


def sitemap(entries, extra=()):
    """sitemap.xml with every language version of every public page."""
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ]
    for e in entries:
        alts = "".join(
            f'\n    <xhtml:link rel="alternate" hreflang="{HREFLANG[l]}" href="{SITE_URL + (e["path"] if l == "en" else "/" + l + e["path"])}"/>'
            for l in LANGS
        ) + f'\n    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE_URL + e["path"]}"/>'
        for l in LANGS:
            loc = SITE_URL + (e["path"] if l == "en" else "/" + l + e["path"])
            lines.append(f"  <url>\n    <loc>{loc}</loc>\n    <lastmod>{e['lastmod']}</lastmod>{alts}\n  </url>")
    for e in extra:
        lines.append(f'  <url>\n    <loc>{SITE_URL + e["path"]}</loc>\n    <lastmod>{e["lastmod"]}</lastmod>\n'
                     f'    <xhtml:link rel="alternate" hreflang="en" href="{SITE_URL + e["path"]}"/>\n  </url>')
    lines.append("</urlset>")
    with open(os.path.join(ROOT, "site", "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print("built sitemap.xml with", len(entries) * len(LANGS) + len(extra), "addresses")


def _num(x):
    t = f"{x:.2f}".rstrip("0").rstrip(".")
    return t


def _ext(url, label):
    return f'<a href="{url}" target="_blank" rel="noopener">{label}</a>'


def summary_block(key, rates, when):
    """Question heading + short answer + data table near the top of each tool page.
    Text is translated by site.js (data-s); numbers are baked in at build time."""
    gcc = ["SAR", "AED", "KWD", "QAR", "OMR", "BHD"]
    home = ["INR", "PKR", "BDT", "PHP", "NPR"]
    iso = when.strftime("%Y-%m-%d")
    cap = stamp_caption(when)
    if key == "ex":
        head_cells = ['<th scope="col" data-s="thGcc"></th>'] + [f'<th scope="col">{c}</th>' for c in home]
        rows = [[f'<th scope="row" dir="ltr">1 {g}</th>'] + [f'<td dir="ltr">{fmt(cross(rates, g, h))}</td>' for h in home] for g in gcc]
    elif key == "send":
        head_cells = ['<th scope="col" data-s="thYouSend"></th>'] + [f'<th scope="col">{c}</th>' for c in home]
        rows = [[f'<th scope="row" dir="ltr">1,000 {g}</th>'] + [f'<td dir="ltr">{fmt(1000 * cross(rates, g, h), 0)}</td>' for h in home] for g in gcc]
    elif key == "eos":
        cap = ""
        head_cells = ['<th scope="col" data-s="thYears"></th>', '<th scope="col" data-s="thAward"></th>', '<th scope="col" data-s="thResign"></th>']
        rows = []
        for y in (1, 2, 3, 5, 7, 10, 15):
            award = 0.5 * y if y <= 5 else 2.5 + (y - 5)
            share = 0 if y < 2 else (1 / 3 if y < 5 else (2 / 3 if y < 10 else 1))
            rows.append([f'<th scope="row" dir="ltr">{y}</th>', f'<td dir="ltr">{_num(award)}</td>', f'<td dir="ltr">{_num(award * share)}</td>'])
    elif key == "id":
        cap = ""
        head_cells = ['<th scope="col" data-s="thCountry"></th>', '<th scope="col" data-s="thIdName"></th>', '<th scope="col" data-s="thCheck"></th>']
        data = [("cSA", "Iqama", _ext("https://www.absher.sa/", "Absher")), ("cKW", "Civil ID", _ext("https://www.paci.gov.kw/", "Sahel / PACI")),
                ("cQA", "QID", _ext("https://portal.moi.gov.qa/", "Metrash")), ("cOM", "Resident Card", _ext("https://www.rop.gov.om/", "ROP")),
                ("cBH", "CPR", _ext("https://www.bahrain.bh/", "bahrain.bh"))]
        rows = [[f'<th scope="row" data-s="{c}"></th>', f'<td dir="ltr">{n}</td>', f'<td dir="ltr">{a}</td>'] for c, n, a in data]
    elif key == "gold":
        g = (_rates_file().get("gold") or {})
        oz = g.get("usd_per_troy_ounce")
        if not oz:
            return ""
        per_g = oz / 31.1035
        gt = _parse_ts(g.get("updated_at")) or when
        cap = stamp_caption(max(gt, when))
        dec = {}
        # Karat purity: 24K = pure spot price, 22K = 24K × 22/24, 21K = 24K × 21/24, 18K = 24K × 18/24 (same as gold-rate.html and fetch_rates.py)
        head_cells = ['<th scope="col" data-s="thGcc"></th>', '<th scope="col">24K</th>', '<th scope="col">22K</th>', '<th scope="col">21K</th>', '<th scope="col">18K</th>']
        rows = [[f'<th scope="row" dir="ltr">{c}</th>'] + [f'<td dir="ltr">{fmt(per_g * p * rates[c], dec.get(c, 2))}</td>' for p in (1, 22 / 24, 21 / 24, 18 / 24)]
                for c in ("SAR", "AED", "QAR", "KWD", "OMR", "BHD")]
    elif key == "vac":
        cap = ""
        head_cells = ['<th scope="col" data-s="thCountry"></th>', '<th scope="col" data-s="thDaysYear"></th>']
        data = [("cSA", "21 → 30 (5+)"), ("cAE", "30"), ("cQA", "21 → 28 (5+)"), ("cKW", "30"), ("cOM", "30"), ("cBH", "30")]
        rows = [[f'<th scope="row" data-s="{c}"></th>', f'<td dir="ltr">{d}</td>'] for c, d in data]
    elif key == "fam":
        cap = ""
        head_cells = ['<th scope="col" data-s="thDeps"></th>', '<th scope="col" data-s="thMonth"></th>', '<th scope="col" data-s="thYear"></th>']
        rows = [[f'<th scope="row" dir="ltr">{n}</th>', f'<td dir="ltr">SAR {400 * n:,}</td>', f'<td dir="ltr">SAR {4800 * n:,}</td>'] for n in (1, 2, 3, 4)]
    elif key == "emb":
        cap = ""
        head_cells = ['<th scope="col" data-s="thNat"></th>', '<th scope="col" data-s="thEmb"></th>', '<th scope="col" data-s="thPass"></th>']
        data = [("cIN", _ext("https://www.eoiriyadh.gov.in/", "eoiriyadh.gov.in"), _ext("https://embassy.passportindia.gov.in/", "embassy.passportindia.gov.in")),
                ("cPK", _ext("https://mofa.gov.pk/overseas-missions", "mofa.gov.pk"), _ext("https://onlinemrp.dgip.gov.pk/", "onlinemrp.dgip.gov.pk")),
                ("cNP", _ext("https://sa.nepalembassy.gov.np/", "sa.nepalembassy.gov.np"), _ext("https://nepalpassport.gov.np/", "nepalpassport.gov.np"))]
        rows = [[f'<th scope="row" data-s="{c}"></th>', f'<td dir="ltr">{a}</td>', f'<td dir="ltr">{b}</td>'] for c, a, b in data]
    else:
        raise SystemExit("unknown summary " + key)
    Q = {"ex": "sumEx", "send": "sumSend", "eos": "sumEos", "id": "sumId", "fam": "sumFam", "emb": "sumEmb", "vac": "sumVac", "gold": "sumGold"}[key]
    body = "".join("<tr>" + "".join(r) + "</tr>" for r in rows)
    return (f'<section class="answer-box" aria-labelledby="sumQ">\n'
            f'        <h2 id="sumQ" data-s="{Q}Q"></h2>\n'
            f'        <p data-s="{Q}A"></p>\n'
            f'        <div class="table-scroll"><table class="summary-table">{cap}<thead><tr>{"".join(head_cells)}</tr></thead><tbody>{body}</tbody></table></div>\n'
            f'      </section>')


HTTPS_RE = re.compile(r"^https://[^\s\"'<>]+$")


def _url(v, label):
    v = (v or "").strip()
    if v and not HTTPS_RE.match(v):
        print("WARNING:", label, "link ignored (must start with https://)")
        return ""
    return v


def load_partners():
    """PARTNER_LINKS: provider id -> {"url", "sponsored"}, from _src/data/partners.json.
    A provider appears only if it has a valid https link or is marked sponsored."""
    with open(os.path.join(ROOT, "_src", "data", "partners.json"), encoding="utf-8") as f:
        raw = json.load(f)
    links = {}
    for k, v in raw.items():
        if k.startswith("_"):
            continue
        if isinstance(v, str):
            v = {"url": v}
        if not isinstance(v, dict):
            continue
        url = _url(v.get("url"), "partner " + k)
        sponsored = v.get("sponsored") is True
        if url or sponsored:
            links[k] = {"url": url, "sponsored": sponsored}
    return links


def essentials_html():
    """Footer 'Expat essentials' card from _src/data/essentials.json (sponsored links only)."""
    with open(os.path.join(ROOT, "_src", "data", "essentials.json"), encoding="utf-8") as f:
        items = json.load(f).get("items", [])
    keys = {"esim": "esim", "insurance": "ins", "relocation": "move"}
    cards = []
    for it in items:
        k = keys.get(it.get("key"))
        url = _url(it.get("url"), "essentials " + str(it.get("key")))
        if not k or not url:
            continue
        cards.append(
            f'<a class="ess-item" href="{url}" target="_blank" rel="sponsored nofollow noopener">'
            f'<span class="ess-ico" aria-hidden="true">{it.get("icon", "")}</span>'
            f'<span><strong data-s="{k}T"></strong><span class="ess-d" data-s="{k}D"></span></span></a>'
        )
    if not cards:
        return ""
    return ('\n      <section class="essentials" aria-labelledby="essT">\n'
            '        <h3 id="essT" data-s="essT"></h3>\n'
            f'        <div class="ess-grid">{"".join(cards)}</div>\n'
            '        <p class="ess-note" data-s="essNote"></p>\n      </section>')


def checkout_html():
    """Playbook buy button when a checkout link is configured, otherwise a waitlist form."""
    with open(os.path.join(ROOT, "_src", "data", "products.json"), encoding="utf-8") as f:
        pb = json.load(f).get("playbook", {})
    url = _url(pb.get("checkout_url"), "playbook checkout")
    if url:
        price = (pb.get("price") or "").strip()
        provider = (pb.get("provider") or "").strip() or "our payment partner"
        price_html = f'<p class="pb-price"><span data-t="priceLabel"></span>: <strong dir="ltr">{price}</strong></p>' if price else ""
        return (f'<div class="pb-buy">{price_html}'
                f'<a class="btn btn-primary btn-lg" href="{url}" target="_blank" rel="noopener" data-t="buyBtn"></a>'
                f'<p class="pb-secure" data-provider="{provider}" data-t="secure"></p></div>')
    return ('<div class="pb-soon"><h2 data-t="soonT"></h2><p data-t="soonText"></p>'
            '<form class="app-form" name="playbook-waitlist" method="POST" action="/" data-ajax data-success="pbOk" novalidate>'
            '<input type="hidden" name="form-name" value="playbook-waitlist">'
            '<input type="hidden" name="language" value="en" data-lang-field>'
            '<p class="hp"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>'
            '<label class="sr-only" for="pbEmail" data-t="email"></label>'
            '<input id="pbEmail" type="email" name="email" required autocomplete="email" inputmode="email" data-t-ph="email">'
            '<button type="submit" class="btn btn-primary" data-t="notifyBtn"></button>'
            '<p class="form-msg" role="alert" aria-live="polite"></p></form>'
            '<div class="success-box" id="pbOk" tabindex="-1" role="status" hidden><span class="check" aria-hidden="true">✓</span><span data-t="ok"></span></div></div>')


ESSENTIALS = ""


def load_site_config():
    with open(os.path.join(ROOT, "_src", "data", "site.json"), encoding="utf-8") as f:
        cfg = json.load(f)
    return {"form_endpoint": _url(cfg.get("form_endpoint"), "form_endpoint"), "rates_api": _url(cfg.get("rates_api"), "rates_api")}


SITE_CFG = {"form_endpoint": "", "rates_api": ""}


def build():
    pages = sorted(p for p in os.listdir(SRC) if p.endswith(".html"))
    global ESSENTIALS, SITE_CFG
    SITE_CFG = load_site_config()
    PARTNER_LINKS = load_partners()
    ESSENTIALS = essentials_html()
    rates, when = load_rates()
    public = []
    for name in pages:
        meta, body, script = parse_page(os.path.join(SRC, name))
        body = re.sub(r"<!--SUMMARY:([a-z]+)-->", lambda m: summary_block(m.group(1), rates, when), body)
        body = body.replace("<!--CHECKOUT-->", checkout_html())
        script = script.replace("/*PARTNERS*/{}", json.dumps(PARTNER_LINKS))
        script = script.replace('/*RATES_API*/""', json.dumps(SITE_CFG["rates_api"]))
        if "/*ICONS*/{}" in script:
            from icons import ICONS as _LUCIDE
            script = script.replace("/*ICONS*/{}", json.dumps(_LUCIDE, separators=(",", ":")))
        script = script.replace("/*VISA*/null", json.dumps(visa_data(), ensure_ascii=False, separators=(",", ":")))
        script = script.replace("/*TELECOM*/null", json.dumps(telecom_data(), ensure_ascii=False, separators=(",", ":")))
        script = script.replace("/*PROVIDERS*/null", json.dumps(remit_providers(), ensure_ascii=False, separators=(",", ":")))
        script = script.replace("/*CHECKED*/{}", json.dumps(checked_provider_rates(), separators=(",", ":")))
        script = script.replace("/*FXBASE*/null", json.dumps(fx_base(), separators=(",", ":")))
        if "/*GOLDBASE*/" in script:
            script = script.replace("/*GOLDBASE*/null", json.dumps(gold_base())).replace("/*GOLDRULES*/null", json.dumps(gold_rules()))
        body = body.replace("__RATESDATE__", when.strftime("%Y-%m-%d"))
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
        html = static_forms(html)
        out = os.path.join(ROOT, "site", name)
        with open(out, "w", encoding="utf-8") as f:
            f.write(html)
        print("built", name)
        if not meta.get("noindex"):
            m = re.search(r'data-updated="(\d{4}-\d{2}-\d{2})"', body)
            public.append({"file": name, "path": meta["path"], "lastmod": m.group(1) if m else "2026-11-13"})
    order = ["/", "/exchange-rate.html", "/gold-rate.html", "/send-money.html", "/sim-internet.html", "/family-visa.html", "/end-of-service.html", "/vacation-calculator.html", "/id-residency.html",
             "/family-cost.html", "/embassy-services.html", "/legal-consult.html", "/financial-playbook.html", "/mobile-app.html", "/about.html", "/contact.html", "/privacy.html",
             "/terms.html", "/affiliate-disclosure.html"]
    public.sort(key=lambda e: order.index(e["path"]) if e["path"] in order else 99)
    subprocess.run(
        ["node", os.path.join(SRC, "..", "prerender.cjs"), json.dumps([{"file": e["file"], "path": e["path"]} for e in public])],
        check=True,
        env=dict(os.environ, TZ="UTC"),  # baked timestamps in UTC; visitors' browsers show their own time zone
    )
    sitemap(public, conversion_pages())
    provider_list()
    latest_json()
    service_worker()
    with open(os.path.join(ROOT, "site", "CNAME"), "w", encoding="utf-8") as f:
        f.write("expatguideme.com\n")
    open(os.path.join(ROOT, "site", ".nojekyll"), "w").close()
    if ADSENSE_CLIENT:
        pub = ADSENSE_CLIENT.replace("ca-", "")
        with open(os.path.join(ROOT, "site", "ads.txt"), "w", encoding="utf-8") as f:
            f.write(f"google.com, {pub}, DIRECT, f08c47fec0942fa0\n")
        print("built ads.txt")


def service_worker():
    """Write site/sw.js with a cache version that changes whenever the shared files change."""
    import hashlib
    h = hashlib.sha1()
    for rel in ("assets/site.js", "assets/site.css", "manifest.webmanifest", "offline.html"):
        with open(os.path.join(ROOT, "site", rel), "rb") as f:
            h.update(f.read())
    with open(os.path.join(SRC, "..", "sw.template.js"), encoding="utf-8") as f:
        js = f.read().replace("__VERSION__", h.hexdigest()[:10])
    with open(os.path.join(ROOT, "site", "sw.js"), "w", encoding="utf-8") as f:
        f.write(js)
    print("built sw.js")


# ---------------------------------------------------------------------------
# Long-tail conversion pages: /1000-sar-to-inr.html and friends (English only).
# Numbers come from _src/data/rates.json, refreshed daily by scripts/update_rates.py.
# ---------------------------------------------------------------------------
CUR = {
    "SAR": ("Saudi riyal", "Saudi riyals", "sa", "Saudi Arabia"),
    "AED": ("UAE dirham", "UAE dirhams", "ae", "the UAE"),
    "KWD": ("Kuwaiti dinar", "Kuwaiti dinars", "kw", "Kuwait"),
    "QAR": ("Qatari riyal", "Qatari riyals", "qa", "Qatar"),
    "OMR": ("Omani rial", "Omani rials", "om", "Oman"),
    "BHD": ("Bahraini dinar", "Bahraini dinars", "bh", "Bahrain"),
    "INR": ("Indian rupee", "Indian rupees", "in", "India"),
    "PKR": ("Pakistani rupee", "Pakistani rupees", "pk", "Pakistan"),
    "BDT": ("Bangladeshi taka", "Bangladeshi taka", "bd", "Bangladesh"),
    "PHP": ("Philippine peso", "Philippine pesos", "ph", "the Philippines"),
    "NPR": ("Nepali rupee", "Nepali rupees", "np", "Nepal"),
    "LKR": ("Sri Lankan rupee", "Sri Lankan rupees", "lk", "Sri Lanka"),
}
CONVERSIONS = [
    ("SAR", "INR"), ("SAR", "PKR"), ("SAR", "BDT"), ("SAR", "PHP"), ("SAR", "NPR"), ("SAR", "LKR"),
    ("AED", "INR"), ("AED", "PKR"), ("AED", "BDT"), ("AED", "PHP"),
    ("KWD", "INR"), ("QAR", "INR"), ("OMR", "INR"), ("BHD", "INR"),
]
AMOUNT = 1000


def _rates_file():
    with open(os.path.join(ROOT, "_src", "data", "rates.json"), encoding="utf-8") as f:
        return json.load(f)


def gold_base():
    """This morning's gold spot price and exchange rates for the gold page (fallback when live APIs fail)."""
    d = _rates_file()
    g = d.get("gold") or {}
    return {"usdOz": g.get("usd_per_troy_ounce"), "at": g.get("updated_at"), "src": g.get("source") or "gold-api.com", "rates": d["rates"]}


def latest_json():
    """site/data/latest.json: the one copy of today's rates and gold that every page reads live.
    Same shape as open.er-api.com (result/rates/time_last_update_unix) plus the gold block."""
    d = _rates_file()
    out = {"result": "success", "base": "USD", "source": d.get("source", "open.er-api.com"),
           "time_last_update_unix": d["time_last_update_unix"], "time_last_update_utc": d.get("time_last_update_utc"),
           "rates": d["rates"], "gold": d.get("gold")}
    os.makedirs(os.path.join(ROOT, "site", "data"), exist_ok=True)
    with open(os.path.join(ROOT, "site", "data", "latest.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, separators=(",", ":"))
    hist = os.path.join(ROOT, "_src", "data", "history.json")
    if os.path.exists(hist):
        shutil.copyfile(hist, os.path.join(ROOT, "site", "data", "history.json"))


def visa_data():
    with open(os.path.join(ROOT, "_src", "data", "family_visa.json"), encoding="utf-8") as f:
        d = json.load(f)
    d.pop("_help", None)
    return d


def telecom_data():
    with open(os.path.join(ROOT, "_src", "data", "telecom.json"), encoding="utf-8") as f:
        d = json.load(f)
    d.pop("_help", None)
    return d


def remit_providers():
    with open(os.path.join(ROOT, "_src", "data", "remit_providers.json"), encoding="utf-8") as f:
        return json.load(f)["providers"]


def provider_list():
    """site/assets/providers.json: provider ids per Gulf country (from _src/data/remit_providers.json).
    The community rates script accepts updates only for these providers."""
    data = {cc: [p["id"] for p in lst] for cc, lst in remit_providers().items()}
    with open(os.path.join(ROOT, "site", "assets", "providers.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, separators=(",", ":"))


def checked_provider_rates():
    """Provider rates checked in each provider's app (_src/data/provider_rates.json),
    without rows older than max_age_hours. The page also re-checks age and distance
    from the live market rate in the visitor's browser."""
    path = os.path.join(ROOT, "_src", "data", "provider_rates.json")
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    max_age = datetime.timedelta(hours=data.get("max_age_hours", 48))
    now = datetime.datetime.now(datetime.timezone.utc)
    out = {}
    for route, provs in (data.get("rates") or {}).items():
        for pid, v in provs.items():
            try:
                at = datetime.datetime.fromisoformat(v["checked_at"].replace("Z", "+00:00"))
                ok = now - at <= max_age and float(v["rate"]) > 0
            except (KeyError, ValueError, TypeError):
                ok = False
            if ok:
                out.setdefault(route, {})[pid] = {"rate": float(v["rate"]), "fee": v.get("fee"), "at": v["checked_at"]}
    return out


def gold_rules():
    with open(os.path.join(ROOT, "_src", "data", "gold.json"), encoding="utf-8") as f:
        r = json.load(f)
    r.pop("_help", None)
    return r


def load_rates():
    with open(os.path.join(ROOT, "_src", "data", "rates.json"), encoding="utf-8") as f:
        data = json.load(f)
    when = datetime.datetime.fromtimestamp(data["time_last_update_unix"], datetime.timezone.utc)
    return data["rates"], when


def _parse_ts(text):
    try:
        return datetime.datetime.fromisoformat(str(text).replace("Z", "+00:00")).astimezone(datetime.timezone.utc)
    except ValueError:
        return None


def stamp_html(when, label="rUpdated", tag="time"):
    """Exact time the data was published by the source. site.js rewrites it into the
    visitor's language and time zone; this UTC text is what shows without JavaScript."""
    iso = when.astimezone(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    text = when.astimezone(datetime.timezone.utc).strftime("%-d %b %Y, %H:%M UTC")
    return f'<{tag} datetime="{iso}" data-ts="{iso}" data-ts-label="{label}">Updated {text}</{tag}>'


def stamp_caption(when):
    return f"<caption>{stamp_html(when)}</caption>"


def fx_base():
    """Last saved market rates, used by the pages only when the live feed fails (with a visible warning)."""
    d = _rates_file()
    return {"rates": d["rates"], "time_last_update_unix": d["time_last_update_unix"]}


def cross(rates, a, b):
    return rates[b] / rates[a]


def fmt(n, d=2):
    return f"{n:,.{d}f}"


def conv_path(a, b, amount=AMOUNT):
    return f"/{amount}-{a.lower()}-to-{b.lower()}.html"


def conversion_page(a, b, rates, when):
    r = cross(rates, a, b)
    inv = 1 / r
    an, apl, acc, actry = CUR[a]
    bn, bpl, bcc, bctry = CUR[b]
    total = AMOUNT * r
    day = when.strftime("%-d %B %Y, %H:%M UTC")
    iso = when.strftime("%Y-%m-%d")
    rdig = 4 if r < 10 else 2
    title = f"{AMOUNT:,} {a} to {b} today: {fmt(total)} {b} | ExpatGuideME"
    desc = (f"{AMOUNT:,} {apl} = {fmt(total)} {bpl} at today's market rate (1 {a} = {fmt(r, rdig)} {b}), "
            f"updated {day}. Table for common amounts and where to compare transfer rates.")
    rows = "".join(
        f"<tr><td>{fmt(x, 0)} {a}</td><td>{fmt(x * r)} {b}</td></tr>" for x in (100, 500, 1000, 2000, 2500, 5000, 10000)
    )
    back = "".join(
        f"<tr><td>{fmt(x, 0)} {b}</td><td>{fmt(x * inv)} {a}</td></tr>" for x in (1000, 10000, 50000, 100000)
    )
    q1 = f"How much is {AMOUNT:,} {a} in {b} today?"
    a1 = (f"At today's market rate, {AMOUNT:,} {apl} ({a}) equals {fmt(total)} {bpl} ({b}). "
          f"One {an} is worth {fmt(r, rdig)} {b}. The rate was last updated on {day}.")
    q2 = f"Will my family in {bctry} receive exactly {fmt(total)} {b}?"
    a2 = ("Usually a little less. Banks, exchange houses and transfer apps pay slightly below the market rate "
          "and some charge a fee, so compare what your family actually receives before you send.")
    q3 = f"Where can I get the best {a} to {b} rate?"
    a3 = (f"Open our send money comparison for {actry} to {bctry}. It lists banks, exchanges and wallets "
          "with each provider's own rate once it has been checked in its app, sorted by what your family receives.")
    faq = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": t}} for q, t in ((q1, a1), (q2, a2), (q3, a3))]}
    others = "".join(
        f'<li><a href="{conv_path(x, y)}">{AMOUNT:,} {x} to {y}</a></li>' for x, y in CONVERSIONS if (x, y) != (a, b)
    )
    meta = {"title": title, "description": desc, "path": conv_path(a, b), "active": "exchange", "en_only": True,
            "style": f'<script type="application/ld+json">{json.dumps(faq, ensure_ascii=False)}</script>'}
    body = f"""
  <main id="main" tabindex="-1">
   <div class="wrap conv-page" data-updated="{iso}">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/exchange-rate.html">Exchange rates</a> › {a} to {b}</nav>
    <h1>{AMOUNT:,} {a} to {b} today</h1>
    <p class="lead">{an} to {bn} at the market rate.</p>
    <p class="rate-stamp">{stamp_html(when)}</p>
    <section class="answer-box" aria-labelledby="ansQ">
      <h2 id="ansQ">{q1}</h2>
      <p class="answer-big"><strong>{AMOUNT:,} {a} = {fmt(total)} {b}</strong></p>
      <p>{a1} {a2}</p>
      <table class="summary-table">
        <caption>{an} to {bn} · {stamp_html(when)}</caption>
        <thead><tr><th scope="col">{apl.capitalize()}</th><th scope="col">{bpl.capitalize()}</th></tr></thead>
        <tbody>{rows}</tbody>
      </table>
      <div class="cta-row">
        <a class="btn btn-primary" href="/send-money.html#{acc}-{bcc}">Compare transfer rates to {bctry}</a>
        <a class="btn" href="/exchange-rate.html">Live converter</a>
      </div>
    </section>
    <section aria-labelledby="backTitle">
      <h2 id="backTitle">{b} to {a}</h2>
      <table class="summary-table">
        <thead><tr><th scope="col">{bpl.capitalize()}</th><th scope="col">{apl.capitalize()}</th></tr></thead>
        <tbody>{back}</tbody>
      </table>
    </section>
    <section class="faq" id="faq" aria-labelledby="faqTitle">
      <h2 id="faqTitle">Frequently asked questions</h2>
      <details><summary>{q1}</summary><div class="answer"><p>{a1}</p></div></details>
      <details><summary>{q2}</summary><div class="answer"><p>{a2}</p></div></details>
      <details><summary>{q3}</summary><div class="answer"><p>{a3}</p></div></details>
    </section>
    <section aria-labelledby="moreTitle">
      <h2 id="moreTitle">Other popular conversions</h2>
      <ul class="conv-links">{others}</ul>
    </section>
    <p class="disclaimer-note">Market rate from {_rates_file().get("source", "open.er-api.com")}, for information only. It is not an offer from any bank or exchange company.</p>
   </div>
  </main>"""
    return meta, body


def conversion_pages():
    rates, when = load_rates()
    out = []
    for a, b in CONVERSIONS:
        meta, body = conversion_page(a, b, rates, when)
        html = (head(meta) + "\n" + header(meta["active"]) + "\n" + body + "\n" + footer(True)
                + '\n  <script src="/assets/site.js"></script>\n</body>\n</html>\n')
        with open(os.path.join(ROOT, "site", meta["path"].lstrip("/")), "w", encoding="utf-8") as f:
            f.write(static_forms(html))
        out.append({"path": meta["path"], "lastmod": when.strftime("%Y-%m-%d")})
    print("built", len(out), "conversion pages")
    return out


if __name__ == "__main__":
    build()
