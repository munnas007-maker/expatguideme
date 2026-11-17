"""Writes _src/pages/offers.html (bank card offers & shopping deals).

    python3 _src/generators/build_offers_page.py

Strings live in offers_strings.py; the offers themselves in _src/data/offers.json,
which _src/build.py puts into the page in place of /*OFFERS*/null.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
from offers_strings import T  # noqa: E402

page = r'''<!--META
title: Bank card offers in Saudi Arabia: Amazon, noon, supermarkets & more | ExpatGuideME
description: Bank card discounts and promo codes from Al Rajhi, SNB, Riyad Bank, SAB, anb, BSF and more for Amazon, noon, supermarkets, travel and restaurants, plus fee-free transfers. Checked every week.
path: /offers.html
active: offers
META-->
<!--STYLE-->
  <style>
    .offers { max-width: 1060px; }
    .cc-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 6px; }
    .cc-tabs button, .cat-chips button { border: 1px solid var(--line); background: var(--card); color: var(--ink); border-radius: 999px; padding: 8px 14px; font: inherit; font-weight: 600; cursor: pointer; min-height: 44px; }
    .cc-tabs button[aria-selected="true"], .cat-chips button[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: #fff; }
    .off-filters { display: grid; gap: 12px; margin: 16px 0 8px; }
    .off-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .cat-chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: thin; }
    .cat-chips button { white-space: nowrap; flex: 0 0 auto; }
    .sec-head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 6px 12px; margin: 26px 0 10px; }
    .sec-head h2 { margin: 0; font-size: 1.25rem; }
    .sec-head .count { color: var(--muted); font-size: .9rem; }
    .stores { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 10px; }
    .store { margin: 0; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
    .store h3 { margin: 0; font-size: 1.02rem; }
    .store .sb { font-size: .85rem; color: var(--muted); margin: 0; }
    .store .sb button { background: none; border: 0; padding: 0; font: inherit; color: var(--accent); font-weight: 700; cursor: pointer; text-decoration: underline; }
    .store .btn { margin-top: auto; padding: 9px 14px; font-size: .92rem; }
    .off-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
    .off { margin: 0; padding: 18px; display: flex; flex-direction: column; gap: 8px; position: relative; }
    .off.is-top { border-color: color-mix(in srgb, var(--accent) 45%, var(--line)); }
    .off-top { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .tagx { font-size: .74rem; font-weight: 700; border-radius: 999px; padding: 3px 9px; background: var(--accent-soft); color: var(--accent); }
    .tagx.bank { background: var(--brand-soft); color: var(--brand); }
    .tagx.pick { background: var(--accent); color: #fff; }
    .off h3 { margin: 2px 0 0; font-size: 1.05rem; }
    .off-benefit { margin: 0; font-size: 1.2rem; font-weight: 700; line-height: 1.3; }
    .off-facts { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: .86rem; color: var(--muted); }
    .off-facts b { color: var(--ink); font-weight: 600; }
    .off-code { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .off-code code { font-size: 1rem; font-weight: 700; letter-spacing: .04em; border: 1px dashed var(--accent); color: var(--ink); border-radius: 8px; padding: 6px 10px; background: var(--accent-soft); }
    .off-code .btn { padding: 6px 12px; font-size: .85rem; min-height: 36px; }
    .off-note { margin: 0; font-size: .86rem; }
    .off-foot { margin-top: auto; padding-top: 8px; border-top: 1px solid var(--line); display: flex; flex-wrap: wrap; gap: 6px 12px; justify-content: space-between; align-items: center; font-size: .85rem; }
    .off-ends { color: var(--muted); }
    .off-ends.soon { color: var(--err-ink); font-weight: 700; }
    .off-foot a { font-weight: 600; }
    .showing { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 0 0 10px; font-weight: 600; }
    .showing button { padding: 6px 12px; min-height: 36px; font-size: .85rem; }
    .off-empty { color: var(--muted); }
    .bank-links { columns: 2 240px; padding: 0; list-style: none; margin: 0; }
    .bank-links li { margin: 0 0 8px; break-inside: avoid; }
    .off-note-box { font-size: .88rem; background: var(--warn-bg); color: var(--warn-ink); border-radius: 10px; padding: 10px 12px; margin-top: 22px; }
    html[data-theme="dark"] .cc-tabs button[aria-selected="true"], html[data-theme="dark"] .cat-chips button[aria-pressed="true"], html[data-theme="dark"] .tagx.pick { color: #1a0d03; }
    @media (max-width: 560px) { .off-row { grid-template-columns: 1fr 1fr; gap: 8px; } .off-list { grid-template-columns: 1fr; } .stores { grid-template-columns: 1fr 1fr; gap: 8px; } .store { padding: 12px; gap: 6px; } .store h3 { font-size: .95rem; } .store .sb { font-size: .78rem; } .store .btn { padding: 8px 6px; font-size: .8rem; } }
  </style>
<!--/STYLE-->
<!--BODY-->
  <main id="main" tabindex="-1">
    <div class="wrap offers" data-updated="__RATESDATE__">
      <h1 data-t="title"></h1>
      <p class="lead" data-t="lead"></p>
      <div class="cc-tabs" id="ccTabs" role="tablist" aria-label="Country"></div>
      <p class="rate-stamp" id="offStamp"></p>
      <div class="off-filters">
        <div>
          <label class="sr-only" for="offSearch" data-t="searchLabel"></label>
          <input type="search" id="offSearch" autocomplete="off" enterkeyhint="search">
        </div>
        <div class="cat-chips" id="catChips" role="group"></div>
        <div class="off-row">
          <div>
            <label class="field-label" for="bankSel" data-t="bankLabel"></label>
            <select id="bankSel"></select>
          </div>
          <div>
            <label class="field-label" for="cardSel" data-t="cardLabel"></label>
            <select id="cardSel"></select>
          </div>
        </div>
      </div>
      <section id="storesSec" aria-labelledby="storesTitle">
        <div class="sec-head"><h2 id="storesTitle" data-t="storesTitle"></h2></div>
        <div class="stores" id="stores"></div>
      </section>
      <section aria-labelledby="offersTitle">
        <div class="sec-head"><h2 id="offersTitle" data-t="offersTitle"></h2><span class="count" id="offCount" aria-live="polite"></span></div>
        <div id="showing"></div>
        <div class="off-list" id="offList"></div>
      </section>
      <div class="ad-slot" data-ad-slot="offers-1" data-t="ad"></div>
      <section aria-labelledby="banksTitle">
        <div class="sec-head"><h2 id="banksTitle" data-t="banksTitle"></h2></div>
        <ul class="bank-links" id="bankLinks"></ul>
      </section>
      <p class="off-note-box" data-t="note"></p>
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
      var DATA = /*OFFERS*/null;   // from _src/data/offers.json, refreshed weekly from the banks' official pages
      var CCS = ["sa", "ae", "qa", "kw", "om", "bh"];
      var CATS = ["all", "online", "grocery", "money", "travel", "food", "health", "fun", "fashion"];
      var CARDS = ["credit", "mada", "prepaid"];
      var lang = "en", cc = "sa", cat = "all", bank = "", card = "", q = "", store = "";
      function $(id) { return document.getElementById(id); }
      function L(k) { return (T[lang] && T[lang][k]) || T.en[k] || window.ExpatSite.t(k); }
      function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
      function safeUrl(u) { return /^https:\/\//.test(u || "") ? u : null; }
      function country() { return (DATA && DATA.countries && DATA.countries[cc]) || { offers: [], stores: [] }; }
      function bankName(id) { var b = DATA && DATA.banks && DATA.banks[id]; return b ? b.name : id; }

      // Today's date in Saudi time (UTC+3), as YYYY-MM-DD.
      function today() { return new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10); }
      function dayNum(s) { var p = s.split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5; }
      function live(o) { var t = today(); return (!o.ends || o.ends >= t) && (!o.starts || o.starts <= t); }
      function fmtDate(s) {
        var p = s.split("-"), d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
        var loc = (lang === "ar" ? "ar-SA" : lang === "tl" ? "fil" : lang) + "-u-nu-latn-ca-gregory";
        try { return d.toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }); } catch (e) { return s; }
      }
      function liveOffers() { return (country().offers || []).filter(live); }

      function matches(o) {
        if (cat !== "all" && o.category !== cat) return false;
        if (bank && o.bank !== bank) return false;
        if (card && (o.cards || []).indexOf(card) < 0) return false;
        if (store && o.store !== store) return false;
        if (q) {
          var hay = [o.merchant, o.benefit, bankName(o.bank), o.code, o.note, L(o.category), T.en[o.category]].join(" ").toLowerCase();
          var words = q.toLowerCase().split(/\s+/).filter(Boolean);
          for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) < 0) return false;
        }
        return true;
      }

      function renderTabs() {
        var box = $("ccTabs"); box.innerHTML = ""; box.setAttribute("aria-label", L("countryLabel"));
        CCS.forEach(function (c) {
          var b = el("button", null, L(c)); b.type = "button"; b.setAttribute("role", "tab");
          b.setAttribute("aria-selected", c === cc ? "true" : "false");
          b.addEventListener("click", function () { setCc(c, false); });
          box.appendChild(b);
        });
      }

      function renderFilters() {
        $("offSearch").setAttribute("placeholder", L("searchPh"));
        var chips = $("catChips"); chips.innerHTML = ""; chips.setAttribute("aria-label", L("catLabel"));
        CATS.forEach(function (c) {
          var b = el("button", null, L(c)); b.type = "button"; b.setAttribute("aria-pressed", c === cat ? "true" : "false");
          b.addEventListener("click", function () { cat = c; store = ""; renderFilters(); renderAll(); });
          chips.appendChild(b);
        });
        var bs = $("bankSel"); bs.innerHTML = "";
        var o0 = el("option", null, L("bankAll")); o0.value = ""; bs.appendChild(o0);
        var ids = [];
        liveOffers().forEach(function (o) { if (ids.indexOf(o.bank) < 0) ids.push(o.bank); });
        ids.sort(function (a, b) { return bankName(a).localeCompare(bankName(b)); });
        if (bank && ids.indexOf(bank) < 0) bank = "";
        ids.forEach(function (id) { var o = el("option", null, bankName(id)); o.value = id; if (id === bank) o.selected = true; bs.appendChild(o); });
        var cs = $("cardSel"); cs.innerHTML = "";
        var c0 = el("option", null, L("cardAny")); c0.value = ""; cs.appendChild(c0);
        CARDS.forEach(function (k) { var o = el("option", null, L(k)); o.value = k; if (k === card) o.selected = true; cs.appendChild(o); });
      }

      function renderStores() {
        var sec = $("storesSec"), box = $("stores"); box.innerHTML = "";
        var list = (country().stores || []).filter(function (s) {
          if (cat !== "all" && cat !== s.kind) return false;
          if (q && s.name.toLowerCase().indexOf(q.toLowerCase()) < 0 && q.toLowerCase().indexOf(s.name.toLowerCase()) < 0) return false;
          return true;
        });
        sec.hidden = !list.length;
        var lo = liveOffers();
        list.forEach(function (s) {
          var card = el("article", "card store");
          card.appendChild(el("h3", null, s.name));
          var n = lo.filter(function (o) { return o.store === s.id; }).length;
          var p = el("p", "sb");
          if (n) {
            var b = el("button", null, L("storeBank").replace("{n}", n)); b.type = "button";
            b.addEventListener("click", function () { store = s.id; cat = "all"; q = ""; $("offSearch").value = ""; renderFilters(); renderAll(); $("offersTitle").scrollIntoView({ behavior: "smooth", block: "start" }); });
            p.appendChild(b);
          } else { p.textContent = L("storeNone"); }
          card.appendChild(p);
          var aff = safeUrl(s.affiliate_url), url = aff || safeUrl(s.url);
          if (url) {
            var a = el("a", "btn btn-ghost", L("storeOffers") + " ↗"); a.href = url; a.target = "_blank";
            a.rel = aff ? "sponsored nofollow noopener" : "noopener";
            card.appendChild(a);
          }
          box.appendChild(card);
        });
      }

      function fact(label, value) { var li = el("li"); li.appendChild(document.createTextNode(label + ": ")); li.appendChild(el("b", null, value)); return li; }

      function renderOffers() {
        var box = $("offList"); box.innerHTML = "";
        var all = liveOffers();
        var list = all.filter(matches).sort(function (a, b) {
          if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
          var ae = a.ends || "9999", be = b.ends || "9999";
          if (ae !== be) return ae < be ? -1 : 1;
          return a.merchant.localeCompare(b.merchant);
        });
        var sh = $("showing"); sh.innerHTML = "";
        if (store) {
          var st = (country().stores || []).filter(function (s) { return s.id === store; })[0];
          var row = el("p", "showing", L("showing").replace("{name}", st ? st.name : store));
          var cl = el("button", "btn btn-ghost", L("clear")); cl.type = "button";
          cl.addEventListener("click", function () { store = ""; renderAll(); });
          row.appendChild(cl); sh.appendChild(row);
        }
        $("offCount").textContent = all.length ? L("count").replace("{n}", list.length) : "";
        if (!all.length) { box.appendChild(el("p", "off-empty", L("soon"))); return; }
        if (!list.length) { box.appendChild(el("p", "off-empty", L("none"))); return; }
        var t = dayNum(today());
        list.forEach(function (o) {
          var c = el("article", "card off" + (o.featured ? " is-top" : ""));
          var top = el("div", "off-top");
          top.appendChild(el("span", "tagx bank", bankName(o.bank)));
          top.appendChild(el("span", "tagx", L(o.category)));
          if (o.featured) top.appendChild(el("span", "tagx pick", "★ " + L("top")));
          c.appendChild(top);
          c.appendChild(el("h3", null, o.merchant));
          var ben = el("p", "off-benefit", o.benefit); ben.lang = "en"; c.appendChild(ben);
          var facts = el("ul", "off-facts");
          var cards = (o.cards || []).filter(function (k) { return CARDS.indexOf(k) > -1; }).map(L);
          facts.appendChild(el("li", null, cards.length ? cards.join(" · ") : L("account")));
          if (o.where && T.en["w_" + o.where]) facts.appendChild(el("li", null, L("w_" + o.where)));
          if (o.min) facts.appendChild(fact(L("min"), o.min));
          if (o.cap) facts.appendChild(fact(L("cap"), o.cap));
          c.appendChild(facts);
          if (o.code) {
            var cr = el("div", "off-code");
            cr.appendChild(el("span", null, L("code") + ":"));
            String(o.code).split(/\s*\/\s*/).forEach(function (code) {
              var k = el("code", null, code); k.dir = "ltr"; cr.appendChild(k);
              var b = el("button", "btn btn-ghost"); b.type = "button"; b.setAttribute("data-copy-text", code);
              var s = el("span", null, window.ExpatSite.t("copy")); s.setAttribute("data-s", "copy"); b.appendChild(s);
              cr.appendChild(b);
            });
            c.appendChild(cr);
          }
          if (o.note) { var n = el("p", "off-note", o.note); n.lang = "en"; c.appendChild(n); }
          var foot = el("div", "off-foot");
          var endTxt, soon = false;
          if (o.ends) {
            var left = dayNum(o.ends) - t;
            endTxt = L("ends").replace("{date}", fmtDate(o.ends)) + " · " + (left <= 0 ? L("lastDay") : L("daysLeft").replace("{n}", left));
            soon = left <= 7;
          } else { endTxt = L("noEnd"); }
          foot.appendChild(el("span", "off-ends" + (soon ? " soon" : ""), endTxt));
          var url = safeUrl(o.url);
          if (url) { var a = el("a", null, L("bankPage") + " ↗"); a.href = url; a.target = "_blank"; a.rel = "noopener"; foot.appendChild(a); }
          c.appendChild(foot);
          box.appendChild(c);
        });
      }

      function renderBanks() {
        var ul = $("bankLinks"); ul.innerHTML = "";
        var banks = (DATA && DATA.banks) || {};
        Object.keys(banks).sort(function (a, b) { return banks[a].name.localeCompare(banks[b].name); }).forEach(function (id) {
          var u = safeUrl(banks[id].offers_url); if (!u) return;
          var li = el("li"), a = el("a", null, banks[id].name + " ↗"); a.href = u; a.target = "_blank"; a.rel = "noopener";
          li.appendChild(a); ul.appendChild(li);
        });
        $("bankLinks").parentNode.hidden = cc !== "sa";
      }

      function renderStamp() {
        var newest = null;
        (country().offers || []).forEach(function (o) { if (o.checked_at && (!newest || o.checked_at > newest)) newest = o.checked_at; });
        $("offStamp").textContent = newest ? L("checked").replace("{time}", window.ExpatSite.stamp(newest)) : "";
      }

      function renderAll() { renderStores(); renderOffers(); renderStamp(); }

      function setCc(c, fromHeader) {
        if (CCS.indexOf(c) < 0) return;
        cc = c; store = ""; bank = "";
        try { localStorage.setItem("egm-offers-cc", c); } catch (e) {}
        if (!fromHeader && window.ExpatSite.setCountry) window.ExpatSite.setCountry(c, true);
        renderTabs(); renderFilters(); renderBanks(); renderAll();
      }

      $("offSearch").addEventListener("input", function () { q = this.value.trim(); store = ""; renderAll(); });
      $("bankSel").addEventListener("change", function () { bank = this.value; renderAll(); });
      $("cardSel").addEventListener("change", function () { card = this.value; renderAll(); });

      var saved = null;
      try { saved = localStorage.getItem("egm-offers-cc"); } catch (e) {}
      var hash = (location.hash || "").slice(1);
      if (CCS.indexOf(hash) > -1) cc = hash;
      else if (window.ExpatSite.hasCountry && window.ExpatSite.hasCountry()) cc = window.ExpatSite.country();
      else if (CCS.indexOf(saved) > -1) cc = saved;
      else if (window.ExpatSite.country) cc = window.ExpatSite.country();
      if (CCS.indexOf(cc) < 0) cc = "sa";
      if (window.ExpatSite.onCountry) window.ExpatSite.onCountry(function (c) { setCc(c, true); });
      window.addEventListener("hashchange", function () { var h = location.hash.slice(1); if (CCS.indexOf(h) > -1) setCc(h, false); });

      window.ExpatSite.onLang(function (l) {
        lang = T[l] ? l : "en";
        document.querySelectorAll("[data-t]").forEach(function (e) { e.textContent = L(e.getAttribute("data-t")); });
        renderTabs(); renderFilters(); renderBanks(); renderAll();
      });
    })();
  </script>
<!--/SCRIPT-->
'''

page = page.replace("__T__", json.dumps(T, ensure_ascii=False))
with open(os.path.join(ROOT, "_src", "pages", "offers.html"), "w", encoding="utf-8") as f:
    f.write(page)
print("written _src/pages/offers.html")
