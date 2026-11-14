import json, sys
sys.path.insert(0, "/tmp/gen")
from sim_strings import T
ROOT = "/home/claude/expatguideme"
page = '''<!--META
title: SIM card & internet offers in Saudi Arabia, UAE, Qatar, Kuwait, Oman & Bahrain | ExpatGuideME
description: All mobile and internet companies in the six Gulf countries on one page: prepaid and postpaid SIM plans, data packages and home internet, with prices from each official website, checked every week.
path: /sim-internet.html
active: sim
META-->
<!--STYLE-->
  <style>
    .sim { max-width: 1000px; }
    .cc-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 6px; }
    .cc-tabs button { border: 1px solid var(--line); background: var(--card); color: var(--ink); border-radius: 999px; padding: 8px 14px; font-weight: 600; cursor: pointer; min-height: 44px; }
    .cc-tabs button[aria-selected="true"] { background: var(--brand); border-color: var(--brand); color: #fff; }
    .ops { display: grid; gap: 16px; margin-top: 14px; }
    .op-head { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; justify-content: space-between; }
    .op-head h2 { margin: 0; font-size: 1.2rem; }
    .kinds { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0 0; padding: 0; list-style: none; }
    .kinds li { font-size: .75rem; font-weight: 600; background: var(--brand-soft); color: var(--brand); border-radius: 999px; padding: 3px 9px; }
    .op-links { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .plans td, .plans th { vertical-align: top; }
    .plans .price { white-space: nowrap; font-weight: 700; }
    .plans .pnote { display: block; color: var(--muted); font-size: .8rem; font-weight: 400; }
    .op-none { color: var(--muted); margin: 10px 0 0; }
    .op-offer { margin: 10px 0 0; font-weight: 600; }
    .sim-note { font-size: .88rem; background: var(--warn-bg); color: var(--warn-ink); border-radius: 10px; padding: 10px 12px; }
    .partner-tag { font-size: .72rem; color: var(--muted); }
  </style>
<!--/STYLE-->
<!--BODY-->
  <main id="main" tabindex="-1">
    <div class="wrap sim" data-updated="__RATESDATE__">
      <h1 data-t="title"></h1>
      <p class="lead" data-t="lead"></p>
      <div class="cc-tabs" id="ccTabs" role="tablist" aria-label="Country"></div>
      <p class="rate-stamp" id="allStamp"></p>
      <div class="ops" id="ops" aria-live="polite"></div>
      <p class="sim-note" data-t="note"></p>
      <div class="ad-slot" data-ad-slot="sim-1" data-t="ad"></div>
      <section class="faq" id="faq" aria-labelledby="faqTitle">
        <h2 id="faqTitle" data-t="faqTitle"></h2>
        <details><summary data-t="q1"></summary><div class="answer"><p data-t="a1"></p></div></details>
        <details><summary data-t="q2"></summary><div class="answer"><p data-t="a2"></p></div></details>
        <details><summary data-t="q3"></summary><div class="answer"><p data-t="a3"></p></div></details>
        <details><summary data-t="q4"></summary><div class="answer"><p data-t="a4"></p></div></details>
      </section>
    </div>
  </main>
<!--/BODY-->
<!--SCRIPT-->
  <script>
    (function () {
      "use strict";
      var T = __T__;
      var DATA = /*TELECOM*/null;   // from _src/data/telecom.json, refreshed weekly from official websites
      var CCS = ["sa", "ae", "qa", "kw", "om", "bh"];
      var CUR = { sa: "SAR", ae: "AED", qa: "QAR", kw: "KWD", om: "OMR", bh: "BHD" };
      var DEC = { KWD: 3, OMR: 3, BHD: 3 };
      var KINDS = ["prepaid", "postpaid", "data", "home", "esim"];
      var lang = "en", cc = "sa";
      function $(id) { return document.getElementById(id); }
      function L(k) { return (T[lang] && T[lang][k]) || T.en[k] || window.ExpatSite.t(k); }
      function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
      function price(p) {
        if (p.price == null || !isFinite(p.price)) return "–";
        var c = p.currency || CUR[cc], d = DEC[c] != null ? DEC[c] : 2;
        var v = Number(p.price).toLocaleString("en-US", { minimumFractionDigits: p.price % 1 ? d : 0, maximumFractionDigits: d });
        return c + " " + v;
      }
      function safeUrl(u) { return /^https:\\/\\//.test(u || "") ? u : null; }

      function renderTabs() {
        var box = $("ccTabs"); box.innerHTML = ""; box.setAttribute("aria-label", L("countryLabel"));
        CCS.forEach(function (c) {
          var b = el("button", null, L(c)); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("data-cc", c);
          b.setAttribute("aria-selected", c === cc ? "true" : "false");
          b.addEventListener("click", function () { setCc(c, false); });
          box.appendChild(b);
        });
      }

      function renderOps() {
        var box = $("ops"); box.innerHTML = "";
        var list = (DATA && DATA.countries && DATA.countries[cc]) || [];
        var newest = null;
        if (!list.length) { box.appendChild(el("p", "op-none", L("empty"))); }
        list.forEach(function (op) {
          if (op.checked_at && (!newest || op.checked_at > newest)) newest = op.checked_at;
          var card = el("section", "card op");
          var head = el("div", "op-head");
          var left = el("div"); left.appendChild(el("h2", null, op.name));
          var kinds = el("ul", "kinds");
          (op.kinds || []).forEach(function (k) { if (KINDS.indexOf(k) > -1) kinds.appendChild(el("li", null, L(k))); });
          if (kinds.children.length) left.appendChild(kinds);
          head.appendChild(left);
          var links = el("div", "op-links");
          var aff = safeUrl(op.affiliate_url), url = aff || safeUrl(op.offers_url) || safeUrl(op.website);
          if (url) {
            var a = el("a", "btn btn-outline", L("official")); a.href = url; a.target = "_blank";
            a.rel = aff ? "sponsored nofollow noopener" : "noopener";
            links.appendChild(a);
            if (aff) links.appendChild(el("span", "partner-tag", L("partner")));
          }
          head.appendChild(links);
          card.appendChild(head);
          if (op.offer && op.offer.text) {
            var of = el("p", "op-offer", "🎁 " + op.offer.text); card.appendChild(of);
          }
          var plans = (op.plans || []).filter(function (p) { return p && p.name; });
          if (plans.length) {
            var wrap = el("div", "table-scroll"), t = el("table", "summary-table plans");
            var thead = el("thead"), hr = el("tr");
            ["colPlan", "colPrice", "colData", "colCalls", "colValidity"].forEach(function (k) { var th = el("th", null, L(k)); th.scope = "col"; hr.appendChild(th); });
            thead.appendChild(hr); t.appendChild(thead);
            var tb = el("tbody");
            plans.forEach(function (p) {
              var tr = el("tr");
              var n = el("td"); var nm = safeUrl(p.url) ? el("a", null, p.name) : el("span", null, p.name);
              if (safeUrl(p.url)) { nm.href = p.url; nm.target = "_blank"; nm.rel = "noopener"; }
              n.appendChild(nm);
              var kindTxt = KINDS.indexOf(p.kind) > -1 ? L(p.kind) : "";
              if (kindTxt || p.note) n.appendChild(el("span", "pnote", [kindTxt, p.note].filter(Boolean).join(" · ")));
              tr.appendChild(n);
              var pr = el("td", "price", price(p)); pr.dir = "ltr"; tr.appendChild(pr);
              tr.appendChild(el("td", null, p.data || "–"));
              tr.appendChild(el("td", null, p.calls || "–"));
              tr.appendChild(el("td", null, p.validity || "–"));
              ["colPlan", "colPrice", "colData", "colCalls", "colValidity"].forEach(function (k, i) { tr.children[i].setAttribute("data-label", L(k)); });
              tb.appendChild(tr);
            });
            t.appendChild(tb); wrap.appendChild(t); card.appendChild(wrap);
          } else {
            card.appendChild(el("p", "op-none", L("none")));
          }
          if (op.checked_at) {
            var st = el("p", "rate-stamp", L("checked").replace("{time}", window.ExpatSite.stamp(op.checked_at)));
            card.appendChild(st);
          }
          box.appendChild(card);
        });
        $("allStamp").textContent = newest ? L("allChecked").replace("{time}", window.ExpatSite.stamp(newest)) : "";
      }

      function setCc(c, fromHeader) {
        if (CCS.indexOf(c) < 0) return;
        cc = c;
        try { localStorage.setItem("egm-sim-cc", c); } catch (e) {}
        if (!fromHeader && window.ExpatSite.setCountry) window.ExpatSite.setCountry(c, true);
        renderTabs(); renderOps();
      }

      var saved = null;
      try { saved = localStorage.getItem("egm-sim-cc"); } catch (e) {}
      var hash = (location.hash || "").slice(1);
      if (CCS.indexOf(hash) > -1) cc = hash;
      else if (window.ExpatSite.hasCountry && window.ExpatSite.hasCountry()) cc = window.ExpatSite.country();
      else if (CCS.indexOf(saved) > -1) cc = saved;
      else if (window.ExpatSite.country) cc = window.ExpatSite.country();
      if (window.ExpatSite.onCountry) window.ExpatSite.onCountry(function (c) { setCc(c, true); });
      window.addEventListener("hashchange", function () { var h = location.hash.slice(1); if (CCS.indexOf(h) > -1) setCc(h, false); });

      window.ExpatSite.onLang(function (l) {
        lang = T[l] ? l : "en";
        document.querySelectorAll("[data-t]").forEach(function (e) { e.textContent = L(e.getAttribute("data-t")); });
        renderTabs(); renderOps();
      });
    })();
  </script>
<!--/SCRIPT-->
'''
page = page.replace("__T__", json.dumps(T, ensure_ascii=False))
open(ROOT + "/_src/pages/sim-internet.html", "w", encoding="utf-8").write(page)
print("written")
