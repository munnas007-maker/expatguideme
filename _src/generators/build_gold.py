# -*- coding: utf-8 -*-
import json, sys
sys.path.insert(0, '/tmp/gen')
from gold_strings import G
T = json.dumps(G, ensure_ascii=False)
page = r'''<!--META
title: Gold rate today in Saudi, UAE, Qatar, Kuwait, Oman & Bahrain + India duty calculator | ExpatGuideME
description: Live gold price per gram for 24K, 22K, 21K and 18K in all six Gulf currencies, sovereign (8 g) price, jewellery value with making charges, and India customs duty for gold.
path: /gold-rate.html
active: gold
META-->
<!--STYLE-->
  <style>
    .gold { max-width: 960px; }
    .gold-live .meta { color: var(--muted); font-size: .85rem; margin-top: 6px; }
    .gold-table td, .gold-table th { white-space: nowrap; }
    .gold-table tr.sel td, .gold-table tr.sel th { background: var(--brand-soft); font-weight: 700; }
    .g-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; align-items: start; }
    .g-grid .card { margin-bottom: 0; }
    .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
    .field { margin-bottom: 14px; }
    .field select { width: 100%; font: inherit; color: var(--ink); background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px; min-height: 46px; }
    .seg { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
    .seg button { font: inherit; font-weight: 600; font-size: .9rem; padding: 7px 14px; border-radius: 999px; cursor: pointer; border: 1px solid var(--line); background: var(--card); color: var(--ink); }
    .seg button[aria-pressed="true"] { background: var(--brand); border-color: var(--brand); color: var(--on-brand); }
    .group-label { font-weight: 600; color: var(--muted); font-size: .9rem; margin-bottom: 8px; }
    .total-box { background: var(--brand-soft); border: 1px solid var(--line); border-radius: 14px; padding: 16px; margin-bottom: 12px; }
    .total-label { font-size: .85rem; font-weight: 700; color: var(--muted); }
    .total { font-size: 1.8rem; font-weight: 800; color: var(--brand); line-height: 1.2; margin-top: 4px; }
    .facts { list-style: none; margin: 0 0 12px; padding: 0; }
    .facts li { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px dashed var(--line); font-size: .93rem; }
    .facts li:last-child { border-bottom: none; }
    .facts .k { color: var(--muted); }
    .facts .v { font-weight: 700; text-align: end; }
    .notes { list-style: none; padding: 0; margin: 0; }
    .notes li { font-size: .88rem; background: var(--warn-bg); color: var(--warn-ink); border-radius: 10px; padding: 9px 12px; margin-bottom: 8px; }
    .src { font-size: .82rem; color: var(--muted); }
    @media (max-width: 760px) { .g-grid { grid-template-columns: 1fr; } .total { font-size: 1.6rem; } }
  </style>
<!--/STYLE-->
<!--BODY-->
  <main id="main" tabindex="-1">
    <div class="wrap gold" data-updated="__DATE__">
      <h1 data-t="title"></h1>
      <p class="lead" data-t="lead"></p>

      <section class="card gold-live" aria-labelledby="liveT">
        <h2 id="liveT" data-t="liveT"></h2>
        <div class="table-scroll"><table class="summary-table gold-table" id="liveTable">
          <thead><tr><th scope="col" data-s="thGcc"></th><th scope="col">24K</th><th scope="col">22K</th><th scope="col">21K</th><th scope="col">18K</th></tr></thead>
          <tbody id="liveRows"></tbody>
        </table></div>
        <p class="meta" id="liveMeta" data-t="loading"></p>
        <p class="src" data-t="srcNote"></p>
      </section>

      <div class="g-grid">
        <section class="card" aria-labelledby="calcT">
          <h2 id="calcT" data-t="calcT"></h2>
          <div class="field"><label class="field-label" for="cur" data-t="curLabel"></label>
            <select id="cur">
              <option value="SAR">🇸🇦 SAR</option><option value="AED">🇦🇪 AED</option><option value="QAR">🇶🇦 QAR</option>
              <option value="KWD">🇰🇼 KWD</option><option value="OMR">🇴🇲 OMR</option><option value="BHD">🇧🇭 BHD</option>
            </select></div>
          <div class="field"><label class="field-label" for="weight" data-t="weight"></label>
            <input type="number" id="weight" inputmode="decimal" min="0" step="any" value="8">
            <div class="presets" id="wPresets">
              <button type="button" class="preset" data-w="8" data-t="p8"></button>
              <button type="button" class="preset" data-w="10" data-t="p10"></button>
              <button type="button" class="preset" data-w="50" data-t="p50"></button>
            </div></div>
          <p class="group-label" id="karatLabel" data-t="karat"></p>
          <div class="seg" id="karatSeg" role="group" aria-labelledby="karatLabel">
            <button type="button" data-k="24">24K</button><button type="button" data-k="22">22K</button><button type="button" data-k="21">21K</button><button type="button" data-k="18">18K</button>
          </div>
          <div class="field"><label class="field-label" for="making" data-t="making"></label>
            <input type="number" id="making" inputmode="decimal" min="0" max="100" step="any" value="0"></div>
        </section>

        <section class="card" aria-live="polite" aria-labelledby="totalLbl">
          <div class="total-box"><div class="total-label" id="totalLbl" data-t="totalV"></div><div class="total" id="totalOut" dir="ltr">–</div></div>
          <ul class="facts">
            <li><span class="k" data-t="metalV"></span><span class="v" id="metalOut" dir="ltr">–</span></li>
            <li><span class="k" data-t="makingV"></span><span class="v" id="makingOut" dir="ltr">–</span></li>
            <li><span class="k" data-t="inInr"></span><span class="v" id="inrOut" dir="ltr">–</span></li>
          </ul>
        </section>
      </div>

      <!--SUMMARY:gold-->

      <div class="ad-slot" data-ad-slot="gold-mid" data-t="ad"></div>

      <section class="card" aria-labelledby="dutyT">
        <h2 id="dutyT" data-t="dutyT"></h2>
        <p data-t="dutyLead"></p>
        <div class="g-grid">
          <div>
            <p class="group-label" id="whoL" data-t="who"></p>
            <div class="seg" id="whoSeg" role="group" aria-labelledby="whoL"><button type="button" data-v="female" data-t="wF"></button><button type="button" data-v="male" data-t="wM"></button></div>
            <p class="group-label" id="stayL" data-t="stay"></p>
            <div class="seg" id="staySeg" role="group" aria-labelledby="stayL"><button type="button" data-v="3" data-t="s1"></button><button type="button" data-v="9" data-t="s2"></button><button type="button" data-v="13" data-t="s3"></button></div>
            <p class="group-label" id="formL" data-t="form"></p>
            <div class="seg" id="formSeg" role="group" aria-labelledby="formL"><button type="button" data-v="j" data-t="fJ"></button><button type="button" data-v="b" data-t="fB"></button></div>
            <div class="field"><label class="field-label" for="dWeight" data-t="dWeight"></label><input type="number" id="dWeight" inputmode="decimal" min="0" step="any" value="50"></div>
          </div>
          <div>
            <ul class="facts">
              <li><span class="k" data-t="free"></span><span class="v" id="freeOut" dir="ltr">–</span></li>
              <li><span class="k" data-t="taxable"></span><span class="v" id="taxOut" dir="ltr">–</span></li>
              <li><span class="k" id="dutyLbl"></span><span class="v" id="dutyOut" dir="ltr">–</span></li>
            </ul>
            <ul class="notes" id="dNotes"></ul>
          </div>
        </div>
        <p class="src" id="dDisc"></p>
      </section>

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
      var BASE = /*GOLDBASE*/null;   // this morning's gold + exchange rates, baked in at build time
      var RULES = /*GOLDRULES*/null; // India customs rules from _src/data/gold.json
      var OZ = 31.1034768;
      var PURITY = { 24: 0.999, 22: 0.916, 21: 0.875, 18: 0.75 };
      var CURS = ["SAR", "AED", "QAR", "KWD", "OMR", "BHD"];
      var DEC = { SAR: 2, AED: 2, QAR: 2, KWD: 3, OMR: 3, BHD: 3, INR: 0 };
      var state = { usdOz: BASE ? BASE.usdOz : null, rates: BASE ? BASE.rates : null, at: BASE ? BASE.at : null, live: false, cur: "SAR", k: 22, who: "female", stay: 13, form: "j" };
      var lang = "en";
      function $(id) { return document.getElementById(id); }
      function L(k) { return (T[lang] && T[lang][k]) || T.en[k] || window.ExpatSite.t(k); }
      function num(id) { var v = parseFloat($(id).value); return isFinite(v) && v > 0 ? v : 0; }
      function fmt(n, d) { return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); }
      function money(n, c) { return c + " " + fmt(n, DEC[c] != null ? DEC[c] : 2); }
      function perGram(cur, k) { return state.usdOz && state.rates ? state.usdOz / OZ * PURITY[k] * state.rates[cur] : null; }
      try { var saved = JSON.parse(localStorage.getItem("egm-gold") || "{}"); if (CURS.indexOf(saved.cur) > -1) state.cur = saved.cur; } catch (e) {}

      function renderLive() {
        var body = $("liveRows"); body.innerHTML = "";
        CURS.forEach(function (c) {
          var tr = document.createElement("tr"); if (c === state.cur) tr.className = "sel";
          var th = document.createElement("th"); th.scope = "row"; th.setAttribute("dir", "ltr"); th.textContent = c; tr.appendChild(th);
          [24, 22, 21, 18].forEach(function (k) { var td = document.createElement("td"); td.setAttribute("dir", "ltr"); var v = perGram(c, k); td.textContent = v ? fmt(v, DEC[c]) : "–"; tr.appendChild(td); });
          tr.style.cursor = "pointer"; tr.addEventListener("click", function () { setCur(c); });
          body.appendChild(tr);
        });
        var m = $("liveMeta");
        if (!state.usdOz) { m.textContent = L("loading"); return; }
        var when = state.at ? new Date(state.at) : null;
        var t = when && !isNaN(when) ? when.toLocaleString(lang === "en" ? "en-GB" : lang, { dateStyle: "medium", timeStyle: "short" }) : "";
        m.textContent = (state.live ? "" : L("offline") + " ") + L("updated").replace("{time}", t);
      }
      function setCur(c) { state.cur = c; $("cur").value = c; try { localStorage.setItem("egm-gold", JSON.stringify({ cur: c })); } catch (e) {} render(); }
      function seg(id, key) { document.querySelectorAll("#" + id + " button").forEach(function (b) { var v = b.getAttribute(key === "k" ? "data-k" : "data-v"); b.setAttribute("aria-pressed", String(String(state[key]) === v)); }); }

      function render() {
        renderLive();
        seg("karatSeg", "k"); seg("whoSeg", "who"); seg("staySeg", "stay"); seg("formSeg", "form");
        var w = num("weight");
        document.querySelectorAll("#wPresets .preset").forEach(function (b) { b.classList.toggle("on", Number(b.getAttribute("data-w")) === w); });
        var pg = perGram(state.cur, state.k), pgInr = perGram("INR", state.k);
        if (pg) {
          var metal = pg * w, mk = metal * num("making") / 100;
          $("metalOut").textContent = money(metal, state.cur);
          $("makingOut").textContent = money(mk, state.cur);
          $("totalOut").textContent = money(metal + mk, state.cur);
          $("inrOut").textContent = "₹ " + fmt((metal + mk) / state.rates[state.cur] * state.rates.INR, 0);
        }
        renderDuty(pgInr);
      }

      function renderDuty(pgInr) {
        var R = (RULES && RULES.india) || null; if (!R) return;
        var W = num("dWeight");
        var allow = (state.form === "j" && state.stay >= R.duty_free_min_months_abroad) ? R.jewellery_duty_free_g[state.who] : 0;
        var free = Math.min(W, allow), tax = Math.max(0, W - free);
        $("freeOut").textContent = fmt(free, free % 1 ? 1 : 0) + " g";
        $("taxOut").textContent = fmt(tax, tax % 1 ? 1 : 0) + " g";
        $("dutyLbl").textContent = L("duty") + " (" + R.concessional_rate_percent + "%)";
        var notes = [];
        if (state.form === "b") notes.push(L("dCoins"));
        if (tax > 0 && state.stay < R.concessional_min_months_abroad) {
          $("dutyOut").textContent = "–"; notes.push(L("dWarnShort"));
        } else if (pgInr) {
          var dInr = tax * pgInr * R.concessional_rate_percent / 100;
          $("dutyOut").textContent = "₹ " + fmt(dInr, 0) + " ≈ " + money(dInr / state.rates.INR * state.rates[state.cur], state.cur);
          if (tax > 0) notes.push(L("dNote1"));
        }
        if (W > R.concessional_max_grams) notes.push(L("dWarnKg"));
        var ul = $("dNotes"); ul.innerHTML = "";
        notes.forEach(function (n) { var li = document.createElement("li"); li.textContent = n; ul.appendChild(li); });
        $("dDisc").textContent = L("dDisc").replace("{date}", RULES.checked).replace("{rate}", R.concessional_rate_percent);
      }

      function loadLive() {
        Promise.all([
          fetch("https://api.gold-api.com/price/XAU").then(function (r) { if (!r.ok) throw 0; return r.json(); }),
          fetch("https://open.er-api.com/v6/latest/USD").then(function (r) { if (!r.ok) throw 0; return r.json(); })
        ]).then(function (res) {
          var oz = parseFloat(res[0].price), rates = res[1] && res[1].rates;
          if (!(oz > 500 && oz < 20000) || !rates || !rates.SAR || !rates.INR) throw 0;
          state.usdOz = oz; state.rates = rates; state.at = res[0].updatedAt || new Date().toISOString(); state.live = true; render();
        }).catch(function () { render(); });
      }

      window.ExpatSite.onLang(function (l) {
        lang = T[l] ? l : "en";
        document.querySelectorAll("[data-t]").forEach(function (el) { el.textContent = L(el.getAttribute("data-t")); });
        render();
      });
      $("cur").value = state.cur;
      $("cur").addEventListener("change", function () { setCur(this.value); });
      $("wPresets").addEventListener("click", function (e) { var b = e.target.closest(".preset"); if (!b) return; $("weight").value = b.getAttribute("data-w"); render(); });
      document.querySelectorAll("#karatSeg button").forEach(function (b) { b.addEventListener("click", function () { state.k = Number(b.getAttribute("data-k")); render(); }); });
      [["whoSeg", "who", String], ["staySeg", "stay", Number], ["formSeg", "form", String]].forEach(function (x) {
        document.querySelectorAll("#" + x[0] + " button").forEach(function (b) { b.addEventListener("click", function () { state[x[1]] = x[2](b.getAttribute("data-v")); render(); }); });
      });
      ["weight", "making", "dWeight"].forEach(function (id) { $(id).addEventListener("input", render); });
      render();
      loadLive();
    })();
  </script>
<!--/SCRIPT-->
'''
open('/home/claude/expatguideme/_src/pages/gold-rate.html', 'w', encoding='utf-8').write(page.replace('__T__', T).replace('__DATE__', '__RATESDATE__'))
print('gold page written')
