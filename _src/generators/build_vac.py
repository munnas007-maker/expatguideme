# -*- coding: utf-8 -*-
import json, sys
sys.path.insert(0, '/tmp/gen')
from vac_strings import V
T = json.dumps(V, ensure_ascii=False)
page = r'''<!--META
title: GCC annual leave & vacation calculator (Saudi, UAE, Qatar, Kuwait, Oman, Bahrain) | ExpatGuideME
description: Free vacation calculator for Gulf expats: leave days earned, 2-year vacation balance and leave salary payout under Saudi Articles 109-111, UAE Article 29 and other GCC labour laws.
path: /vacation-calculator.html
active: vac
META-->
<!--STYLE-->
  <style>
    .vac { max-width: 960px; }
    .country-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin: 6px 0 18px; }
    .country-tabs button, .seg button {
      font: inherit; font-weight: 600; font-size: 0.95rem; padding: 8px 16px; border-radius: 999px; cursor: pointer;
      border: 1px solid var(--line); background: var(--card); color: var(--ink);
    }
    .country-tabs button:hover, .seg button:hover { border-color: var(--brand); color: var(--brand); }
    .country-tabs button[aria-pressed="true"], .seg button[aria-pressed="true"] { background: var(--brand); border-color: var(--brand); color: var(--on-brand); }
    .seg { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .seg button { font-size: 0.9rem; padding: 7px 14px; }
    .group-label { font-weight: 600; color: var(--muted); font-size: 0.9rem; margin-bottom: 8px; }
    .calc-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 18px; align-items: start; }
    .calc-grid .card { margin-bottom: 0; }
    .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
    .field { margin-bottom: 14px; }
    .result { position: sticky; top: 84px; }
    .total-box { background: var(--brand-soft); border: 1px solid var(--line); border-radius: 14px; padding: 16px; margin-bottom: 14px; }
    .total-label { font-size: 0.85rem; font-weight: 700; color: var(--muted); }
    .total { font-size: 2rem; font-weight: 800; color: var(--brand); line-height: 1.2; margin-top: 4px; }
    .facts { list-style: none; margin: 0 0 12px; padding: 0; }
    .facts li { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px dashed var(--line); font-size: 0.93rem; }
    .facts li:last-child { border-bottom: none; }
    .facts .k { color: var(--muted); }
    .facts .v { font-weight: 700; text-align: end; }
    .notes { list-style: none; padding: 0; margin: 0 0 6px; }
    .notes li { font-size: 0.88rem; background: var(--warn-bg); color: var(--warn-ink); border-radius: 10px; padding: 9px 12px; margin-bottom: 8px; }
    .guide h3 { font-size: 1.05rem; margin: 18px 0 6px; }
    .guide p { margin-bottom: 10px; }
    .src { font-size: 0.85rem; color: var(--muted); }
    .disclosure { font-size: 0.85rem; color: var(--muted); border-inline-start: 3px solid var(--line); padding-inline-start: 10px; margin: 18px 0; }
    .xlink { display: inline-block; margin-top: 4px; font-weight: 600; }
    @media (max-width: 760px) { .calc-grid { grid-template-columns: 1fr; } .result { position: static; } .total { font-size: 1.7rem; } }
  </style>
<!--/STYLE-->
<!--BODY-->
  <main id="main" tabindex="-1">
    <div class="wrap vac" data-updated="2026-11-14">
      <h1 data-t="title"></h1>
      <p class="lead" data-t="lead"></p>

      <section aria-labelledby="calcTitle">
        <h2 id="calcTitle" data-t="calcTitle"></h2>
        <p class="group-label" id="countryLabel" data-t="countryLabel"></p>
        <div class="country-tabs" id="countryTabs" role="group" aria-labelledby="countryLabel">
          <button type="button" data-cc="sa"><span aria-hidden="true">🇸🇦</span> <span data-s="cSA"></span></button>
          <button type="button" data-cc="ae"><span aria-hidden="true">🇦🇪</span> <span data-s="cAE"></span></button>
          <button type="button" data-cc="qa"><span aria-hidden="true">🇶🇦</span> <span data-s="cQA"></span></button>
          <button type="button" data-cc="kw"><span aria-hidden="true">🇰🇼</span> <span data-s="cKW"></span></button>
          <button type="button" data-cc="om"><span aria-hidden="true">🇴🇲</span> <span data-s="cOM"></span></button>
          <button type="button" data-cc="bh"><span aria-hidden="true">🇧🇭</span> <span data-s="cBH"></span></button>
        </div>

        <div class="calc-grid">
          <form class="card" id="vacForm" novalidate>
            <p class="group-label" id="presetLabel" data-t="presetLabel"></p>
            <div class="presets" role="group" aria-labelledby="presetLabel" id="svcPresets">
              <button type="button" class="preset" data-y="1" data-t="p1"></button>
              <button type="button" class="preset" data-y="2" data-t="p2"></button>
              <button type="button" class="preset" data-y="5" data-t="p5"></button>
            </div>
            <div class="row2" style="margin-top:14px">
              <div>
                <label class="field-label" for="years" data-t="yearsLabel"></label>
                <input type="number" id="years" inputmode="numeric" min="0" max="60" step="1" value="2">
              </div>
              <div>
                <label class="field-label" for="months" data-t="monthsLabel"></label>
                <input type="number" id="months" inputmode="numeric" min="0" max="11" step="1" value="0">
              </div>
            </div>
            <div class="field">
              <label class="field-label" for="basic" id="basicLabel"></label>
              <input type="number" id="basic" inputmode="decimal" min="0" step="any" autocomplete="off">
            </div>
            <div class="field">
              <label class="field-label" for="allow" id="allowLabel"></label>
              <input type="number" id="allow" inputmode="decimal" min="0" step="any" autocomplete="off" value="0">
            </div>
            <div class="field">
              <label class="field-label" for="used" data-t="usedLabel"></label>
              <input type="number" id="used" inputmode="decimal" min="0" step="any" autocomplete="off" value="0">
            </div>
            <p class="group-label" id="baseLabel" data-t="baseLabel"></p>
            <div class="seg" id="baseSeg" role="group" aria-labelledby="baseLabel">
              <button type="button" data-base="full" data-t="baseFull"></button>
              <button type="button" data-base="basic" data-t="baseBasic"></button>
            </div>
          </form>

          <section class="card result" aria-labelledby="resultTitle" aria-live="polite">
            <h2 id="resultTitle" data-t="resultTitle"></h2>
            <div class="total-box">
              <div class="total-label" data-t="balance"></div>
              <div class="total" id="balanceOut" dir="ltr">0</div>
            </div>
            <ul class="facts">
              <li><span class="k" data-t="perYear"></span><span class="v" id="perYearOut" dir="ltr"></span></li>
              <li><span class="k" data-t="accrued"></span><span class="v" id="accruedOut" dir="ltr"></span></li>
              <li><span class="k" data-t="usedK"></span><span class="v" id="usedOut" dir="ltr"></span></li>
              <li><span class="k" data-t="dayRate"></span><span class="v" id="rateOut" dir="ltr">–</span></li>
              <li><span class="k" data-t="cash"></span><span class="v" id="cashOut" dir="ltr">–</span></li>
            </ul>
            <ul class="notes" id="notes"></ul>
            <a class="xlink" href="/end-of-service.html" data-t="xEos"></a>
          </section>
        </div>
      </section>

      <!--SUMMARY:vac-->

      <div class="ad-slot" data-ad-slot="vacation-mid" data-t="ad"></div>

      <section class="guide" aria-labelledby="gTitle">
        <h2 id="gTitle" data-t="gTitle"></h2>
        <h3 data-t="gCarryT"></h3>
        <p data-t="gCarrySa"></p>
        <p data-t="gCarryAe"></p>
        <p data-t="gCarryOther"></p>
        <h3 data-t="gHolT"></h3>
        <p data-t="gHolSa"></p>
        <h3 data-t="gPayT"></h3>
        <p data-t="gPaySa"></p>
        <p data-t="gPayAe"></p>
        <p class="src" data-t="gSrc"></p>
      </section>

      <p class="disclosure" data-t="disclaimer"></p>

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
      var C = {
        sa: { cur: "SAR", base: "full", wait: 0, note: "nSA" },
        ae: { cur: "AED", base: "basic", wait: 6, note: "nAE" },
        qa: { cur: "QAR", base: "basic", wait: 12, note: "nQA" },
        kw: { cur: "KWD", base: "full", wait: 9, note: "nKW" },
        om: { cur: "OMR", base: "full", wait: 6, note: "nOM" },
        bh: { cur: "BHD", base: "full", wait: 0, note: "nBH" }
      };
      var state = { cc: "sa", base: "full" };
      var lang = "en";
      function $(id) { return document.getElementById(id); }
      function L(k) { return (T[lang] && T[lang][k]) || T.en[k] || window.ExpatSite.t(k); }
      function fill(s, o) { return s.replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }
      function num(id) { var v = parseFloat($(id).value); return isFinite(v) && v > 0 ? v : 0; }
      function fmt(n, d) { return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); }
      function fmtDays(n) { var r = Math.round(n * 10) / 10; return fill(L("days"), { n: r % 1 ? fmt(r, 1) : fmt(r, 0) }); }

      // Statutory minimum leave earned over the whole service (months).
      function earned(cc, m) {
        var y = m / 12;
        if (cc === "sa") return y <= 5 ? 21 * y : 105 + 30 * (y - 5);
        if (cc === "ae") return m < 6 ? 0 : (m < 12 ? 2 * m : 30 * y);
        if (cc === "qa") return m < 12 ? 0 : (y <= 5 ? 21 * y : 105 + 28 * (y - 5));
        if (cc === "kw") return m < 9 ? 0 : 30 * y;
        if (cc === "om") return m < 6 ? 0 : 30 * y;
        return 30 * y; // bh: 2.5 days per month
      }
      function perYear(cc, m) {
        if (cc === "sa") return m >= 60 ? 30 : 21;
        if (cc === "qa") return m >= 60 ? 28 : 21;
        return 30;
      }

      function setCountry(cc) {
        if (!C[cc]) return;
        state.cc = cc; state.base = C[cc].base;
        document.querySelectorAll("#countryTabs button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cc") === cc)); });
        try { if (location.hash !== "#" + cc) history.replaceState(null, "", "#" + cc); } catch (e) {}
        render();
      }
      function render() {
        var c = C[state.cc];
        $("basicLabel").textContent = fill(L("basicLabel"), { cur: c.cur });
        $("allowLabel").textContent = fill(L("allowLabel"), { cur: c.cur });
        document.querySelectorAll("#baseSeg button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-base") === state.base)); });
        var months = Math.max(0, Math.round(num("years") * 12 + Math.min(11, num("months"))));
        document.querySelectorAll("#svcPresets .preset").forEach(function (b) { b.classList.toggle("on", months === Number(b.getAttribute("data-y")) * 12); });
        var acc = earned(state.cc, months);
        var used = num("used");
        var bal = Math.max(0, acc - used);
        $("perYearOut").textContent = fmtDays(perYear(state.cc, months));
        $("accruedOut").textContent = fmtDays(acc);
        $("usedOut").textContent = fmtDays(used);
        $("balanceOut").textContent = fmtDays(bal);
        var wage = num("basic") + (state.base === "full" ? num("allow") : 0);
        if (wage > 0) {
          var rate = wage / 30;
          $("rateOut").textContent = c.cur + " " + fmt(rate, 2);
          $("cashOut").textContent = c.cur + " " + fmt(rate * bal, 2);
        } else {
          $("rateOut").textContent = "–";
          $("cashOut").textContent = L("empty");
        }
        var notes = [L(c.note)];
        if (c.wait && months < c.wait) notes.push(fill(L("wait"), { n: c.wait }));
        if (used > acc && acc > 0) notes.push(L("over"));
        $("notes").innerHTML = "";
        notes.forEach(function (n) { var li = document.createElement("li"); li.textContent = n; $("notes").appendChild(li); });
      }

      window.ExpatSite.onLang(function (l) {
        lang = T[l] ? l : "en";
        document.querySelectorAll("[data-t]").forEach(function (el) { el.textContent = L(el.getAttribute("data-t")); });
        render();
      });
      document.querySelectorAll("#countryTabs button").forEach(function (b) { b.addEventListener("click", function () { setCountry(b.getAttribute("data-cc")); }); });
      document.querySelectorAll("#baseSeg button").forEach(function (b) { b.addEventListener("click", function () { state.base = b.getAttribute("data-base"); render(); }); });
      $("svcPresets").addEventListener("click", function (e) {
        var b = e.target.closest(".preset"); if (!b) return;
        $("years").value = b.getAttribute("data-y"); $("months").value = 0; render();
      });
      ["years", "months", "basic", "allow", "used"].forEach(function (id) { $(id).addEventListener("input", render); });
      $("vacForm").addEventListener("submit", function (e) { e.preventDefault(); });
      var h = (location.hash || "").slice(1);
      setCountry(C[h] ? h : "sa");
    })();
  </script>
<!--/SCRIPT-->
'''
open('/home/claude/expatguideme/_src/pages/vacation-calculator.html', 'w', encoding='utf-8').write(page.replace('__T__', T))
print('written')
