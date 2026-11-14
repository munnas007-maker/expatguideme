import json, sys
sys.path.insert(0, "/tmp/gen")
from visa_strings import T
ROOT = "/home/claude/expatguideme"
page = '''<!--META
title: Family visa & visit visa guide: Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain | ExpatGuideME
description: How to bring your family to the Gulf: family residence visa and family visit visa requirements, documents, step-by-step application and government fees for all six GCC countries, from official sources.
path: /family-visa.html
active: visa
META-->
<!--STYLE-->
  <style>
    .visa { max-width: 900px; }
    .cc-tabs, .kind-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 6px; }
    .cc-tabs button, .kind-tabs button { border: 1px solid var(--line); background: var(--card); color: var(--ink); border-radius: 999px; padding: 8px 14px; font-weight: 600; cursor: pointer; min-height: 44px; }
    .cc-tabs button[aria-selected="true"], .kind-tabs button[aria-selected="true"] { background: var(--brand); border-color: var(--brand); color: #fff; }
    .vsec h3 { margin: 18px 0 8px; font-size: 1.05rem; }
    .vsec ul, .vsec ol { margin: 0; padding-inline-start: 22px; }
    .vsec li { margin: 6px 0; line-height: 1.55; }
    .vsec ol li::marker { font-weight: 700; color: var(--brand); }
    .vsum { font-size: 1.02rem; }
    .en-only { font-size: .82rem; color: var(--muted); font-style: italic; }
    .visa-note { font-size: .88rem; background: var(--warn-bg); color: var(--warn-ink); border-radius: 10px; padding: 10px 12px; }
    .vlinks { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .vsrc { font-size: .82rem; color: var(--muted); word-break: break-word; }
  </style>
<!--/STYLE-->
<!--BODY-->
  <main id="main" tabindex="-1">
    <div class="wrap visa" data-updated="__RATESDATE__">
      <h1 data-t="title"></h1>
      <p class="lead" data-t="lead"></p>
      <div class="cc-tabs" id="ccTabs" role="tablist"></div>
      <div class="kind-tabs" id="kindTabs" role="tablist"></div>
      <section class="card vsec" id="vbox" aria-live="polite"></section>
      <p class="visa-note" data-t="disclaimer"></p>
      <div class="ad-slot" data-ad-slot="visa-1" data-t="ad"></div>
    </div>
  </main>
<!--/BODY-->
<!--SCRIPT-->
  <script>
    (function () {
      "use strict";
      var T = __T__;
      var DATA = /*VISA*/null;   // from _src/data/family_visa.json, checked monthly against official government sources
      var CCS = ["sa", "ae", "qa", "kw", "om", "bh"], KINDS = ["family", "visit"];
      var DEC = { KWD: 3, OMR: 3, BHD: 3 };
      var lang = "en", cc = "sa", kind = "family";
      function $(id) { return document.getElementById(id); }
      function L(k) { return (T[lang] && T[lang][k]) || T.en[k] || window.ExpatSite.t(k); }
      function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
      function safeUrl(u) { return /^https:\\/\\//.test(u || "") ? u : null; }
      function tabs(boxId, list, cur, label, onPick) {
        var box = $(boxId); box.innerHTML = "";
        list.forEach(function (v) {
          var b = el("button", null, L(v)); b.type = "button"; b.setAttribute("role", "tab");
          b.setAttribute("aria-selected", v === cur ? "true" : "false");
          b.addEventListener("click", function () { onPick(v); });
          box.appendChild(b);
        });
      }
      function list(tag, items) { var l = el(tag); items.forEach(function (t) { l.appendChild(el("li", null, t)); }); return l; }
      function render() {
        tabs("ccTabs", CCS, cc, "countryLabel", function (v) { setCc(v, false); });
        tabs("kindTabs", KINDS, kind, "family", function (v) { kind = v; save(); render(); });
        var box = $("vbox"); box.innerHTML = "";
        var e = DATA && DATA.countries && DATA.countries[cc] && DATA.countries[cc][kind];
        box.appendChild(el("h2", null, L(kind) + " · " + L(cc)));
        if (!e || !e.text || !e.text.en) {
          box.appendChild(el("p", null, L("pending")));
        } else {
          var t = e.text[lang] && e.text[lang].summary ? e.text[lang] : e.text.en;
          if (t !== e.text[lang] && lang !== "en") box.appendChild(el("p", "en-only", L("enOnly")));
          if (t.summary) box.appendChild(el("p", "vsum", t.summary));
          [["who", "ul"], ["documents", "ul"], ["steps", "ol"]].forEach(function (s) {
            if (t[s[0]] && t[s[0]].length) { box.appendChild(el("h3", null, L(s[0]))); box.appendChild(list(s[1], t[s[0]])); }
          });
          var fees = (e.fees || []).filter(function (f) { return f && f.item; });
          if (fees.length) {
            box.appendChild(el("h3", null, L("fees")));
            box.appendChild(list("ul", fees.map(function (f) {
              var ftxt = (t.fee_items && t.fee_items[f.item]) || f.item;
              if (typeof f.amount !== "number") return ftxt;
              var d = DEC[f.currency] != null ? DEC[f.currency] : 2;
              return ftxt + ": " + f.currency + " " + f.amount.toLocaleString("en-US", { minimumFractionDigits: f.amount % 1 ? d : 0, maximumFractionDigits: d });
            })));
          }
          if (t.processing) { box.appendChild(el("h3", null, L("processing"))); box.appendChild(el("p", null, t.processing)); }
          if (t.validity) { box.appendChild(el("h3", null, L("validity"))); box.appendChild(el("p", null, t.validity)); }
          if (t.notes && t.notes.length) { box.appendChild(el("h3", null, L("notes"))); box.appendChild(list("ul", t.notes)); }
        }
        var off = ((e && e.official) || (DATA && DATA.portals && DATA.portals[cc]) || []).filter(function (o) { return safeUrl(o.url); });
        if (off.length) {
          box.appendChild(el("h3", null, L("official")));
          var lk = el("div", "vlinks");
          off.forEach(function (o) { var a = el("a", "btn btn-ghost", o.name); a.href = o.url; a.target = "_blank"; a.rel = "noopener"; lk.appendChild(a); });
          box.appendChild(lk);
        }
        if (e && e.sources && e.sources.length) {
          box.appendChild(el("h3", null, L("sources")));
          var sl = el("ul", "vsrc");
          e.sources.filter(safeUrl).forEach(function (u) { var li = el("li"), a = el("a", null, u.replace(/^https:\\/\\//, "")); a.href = u; a.target = "_blank"; a.rel = "noopener"; li.appendChild(a); sl.appendChild(li); });
          box.appendChild(sl);
        }
        if (e && e.checked_at) box.appendChild(el("p", "rate-stamp", L("checked").replace("{time}", window.ExpatSite.stamp(e.checked_at))));
      }
      function save() { try { localStorage.setItem("egm-visa", JSON.stringify({ cc: cc, kind: kind })); } catch (x) {} }
      function setCc(c, fromHeader) {
        if (CCS.indexOf(c) < 0) return;
        cc = c; save();
        if (!fromHeader && window.ExpatSite.setCountry) window.ExpatSite.setCountry(c, true);
        render();
      }
      var saved = null; try { saved = JSON.parse(localStorage.getItem("egm-visa") || "null"); } catch (x) {}
      if (saved && KINDS.indexOf(saved.kind) > -1) kind = saved.kind;
      var h = (location.hash || "").slice(1).split("-");
      if (CCS.indexOf(h[0]) > -1) { cc = h[0]; if (KINDS.indexOf(h[1]) > -1) kind = h[1]; }
      else if (window.ExpatSite.hasCountry && window.ExpatSite.hasCountry()) cc = window.ExpatSite.country();
      else if (saved && CCS.indexOf(saved.cc) > -1) cc = saved.cc;
      else if (window.ExpatSite.country) cc = window.ExpatSite.country();
      if (window.ExpatSite.onCountry) window.ExpatSite.onCountry(function (c) { setCc(c, true); });
      window.ExpatSite.onLang(function (l) {
        lang = T[l] ? l : "en";
        document.querySelectorAll("[data-t]").forEach(function (x) { x.textContent = L(x.getAttribute("data-t")); });
        render();
      });
    })();
  </script>
<!--/SCRIPT-->
'''
open(ROOT + "/_src/pages/family-visa.html", "w", encoding="utf-8").write(page.replace("__T__", json.dumps(T, ensure_ascii=False)))
print("ok")
