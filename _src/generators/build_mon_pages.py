# -*- coding: utf-8 -*-
import json, sys
sys.path.insert(0, '/tmp/gen')
from consult_strings import C
from playbook_strings import G
R = '/home/claude/expatguideme/_src/pages/'
SCRIPT = r'''<!--SCRIPT-->
  <script>
    (function () {
      "use strict";
      var T = __T__;
      window.ExpatSite.onLang(function (lang) {
        var L = T[lang] || T.en;
        document.querySelectorAll("[data-t]").forEach(function (el) {
          var v = L[el.getAttribute("data-t")] || T.en[el.getAttribute("data-t")] || "";
          var p = el.getAttribute("data-provider");
          el.textContent = p ? v.replace("{provider}", p) : v;
        });
        document.querySelectorAll("[data-t-ph]").forEach(function (el) { el.setAttribute("placeholder", L[el.getAttribute("data-t-ph")] || ""); });
      });
    })();
  </script>
<!--/SCRIPT-->
'''
consult = r'''<!--META
title: Ask an expert: end of service and labour contract review for Gulf expats | ExpatGuideME
description: Not sure your end of service, final settlement or contract is right? Send a free request and get next steps, with the option to reach an independent Gulf labour advisor.
path: /legal-consult.html
active: consult
META-->
<!--STYLE-->
  <style>
    .lc { max-width: 820px; }
    .not-firm { background: var(--warn-bg); color: var(--warn-ink); border-radius: 12px; padding: 12px 14px; font-weight: 600; font-size: .92rem; }
    .steps { counter-reset: s; list-style: none; padding: 0; display: grid; gap: 10px; }
    .steps li { counter-increment: s; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px 12px 52px; position: relative; }
    .steps li::before { content: counter(s); position: absolute; inset-inline-start: 14px; top: 11px; width: 26px; height: 26px; border-radius: 50%; background: var(--brand); color: var(--on-brand); display: grid; place-items: center; font-weight: 700; }
    [dir="rtl"] .steps li { padding: 12px 52px 12px 14px; }
    .lc-form .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .lc-form .field { margin-bottom: 14px; }
    .lc-form select, .lc-form textarea { width: 100%; font: inherit; color: var(--ink); background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px; min-height: 46px; }
    .lc-form textarea { min-height: 130px; resize: vertical; }
    .hint { font-size: .82rem; color: var(--muted); margin-top: 6px; }
    .consent { display: flex; gap: 10px; align-items: flex-start; font-size: .92rem; margin: 6px 0 14px; }
    .consent input { width: 20px; height: 20px; margin-top: 2px; flex: none; }
    .free-help a { font-weight: 600; }
    @media (max-width: 640px) { .lc-form .row2 { grid-template-columns: 1fr; } }
  </style>
<!--/STYLE-->
<!--BODY-->
  <main id="main" tabindex="-1">
    <div class="wrap lc" data-updated="2026-11-14">
      <h1 data-t="title"></h1>
      <p class="lead" data-t="lead"></p>
      <p class="not-firm" data-t="notFirm"></p>

      <section aria-labelledby="howT">
        <h2 id="howT" data-t="howT"></h2>
        <ol class="steps"><li data-t="how1"></li><li data-t="how2"></li><li data-t="how3"></li></ol>
      </section>

      <section class="card" aria-labelledby="formT">
        <h2 id="formT" data-t="formT"></h2>
        <form class="lc-form" name="expert-review" method="POST" action="/" data-ajax data-success="lcOk" novalidate>
          <input type="hidden" name="form-name" value="expert-review">
          <input type="hidden" name="language" value="en" data-lang-field>
          <p class="hp"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
          <div class="row2">
            <div class="field"><label class="field-label" for="lcName" data-t="name"></label><input id="lcName" type="text" name="name" required autocomplete="name" maxlength="80"></div>
            <div class="field"><label class="field-label" for="lcEmail" data-t="email"></label><input id="lcEmail" type="email" name="email" required autocomplete="email" inputmode="email" maxlength="120"></div>
          </div>
          <div class="row2">
            <div class="field"><label class="field-label" for="lcCountry" data-t="country"></label>
              <select id="lcCountry" name="country" required>
                <option value=""></option>
                <option value="Saudi Arabia" data-s="cSA"></option><option value="UAE" data-s="cAE"></option><option value="Qatar" data-s="cQA"></option>
                <option value="Kuwait" data-s="cKW"></option><option value="Oman" data-s="cOM"></option><option value="Bahrain" data-s="cBH"></option>
                <option value="Other" data-t="countryOther"></option>
              </select></div>
            <div class="field"><label class="field-label" for="lcTopic" data-t="topic"></label>
              <select id="lcTopic" name="topic" required>
                <option value=""></option>
                <option value="End of service" data-t="tEos"></option><option value="Contract dispute" data-t="tContract"></option>
                <option value="Unpaid salary" data-t="tSalary"></option><option value="Annual leave" data-t="tLeave"></option><option value="Other" data-t="tOther"></option>
              </select></div>
          </div>
          <div class="field"><label class="field-label" for="lcMsg" data-t="message"></label>
            <textarea id="lcMsg" name="message" required maxlength="2000"></textarea>
            <p class="hint" data-t="msgHint"></p></div>
          <label class="consent"><input type="checkbox" name="consent" value="yes" required><span data-t="consent"></span></label>
          <button type="submit" class="btn btn-primary" data-t="send"></button>
          <p class="form-msg" role="alert" aria-live="polite"></p>
        </form>
        <div class="success-box" id="lcOk" tabindex="-1" role="status" hidden><span class="check" aria-hidden="true">✓</span><span data-t="ok"></span></div>
      </section>

      <section class="free-help" aria-labelledby="freeT">
        <h2 id="freeT" data-t="freeT"></h2>
        <p><a href="/end-of-service.html" data-t="free1"></a></p>
        <p><a href="/vacation-calculator.html" data-s="navVac"></a></p>
        <p data-t="free2"></p>
      </section>

      <section class="faq" id="faq" aria-labelledby="faqTitle">
        <h2 id="faqTitle" data-t="faqTitle"></h2>
        <details><summary data-t="q1"></summary><div class="answer"><p data-t="a1"></p></div></details>
        <details><summary data-t="q2"></summary><div class="answer"><p data-t="a2"></p></div></details>
      </section>
    </div>
  </main>
<!--/BODY-->
''' + SCRIPT.replace('__T__', json.dumps(C, ensure_ascii=False))

playbook = r'''<!--META
title: The Ultimate GCC Expat Financial Playbook | ExpatGuideME
description: A practical money guide for Gulf expats: allowances, end of service, sending money home, saving and planning your return. Read three free sections.
path: /financial-playbook.html
active: playbook
META-->
<!--STYLE-->
  <style>
    .pb { max-width: 820px; }
    .pb-badge { display: inline-block; background: var(--brand-soft); color: var(--brand-dark); border-radius: 999px; padding: 4px 12px; font-weight: 700; font-size: .85rem; margin-bottom: 6px; }
    .pb-buy, .pb-soon { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 20px; margin: 18px 0; }
    .pb-soon h2 { margin-top: 0; }
    .pb-price { font-size: 1.2rem; }
    .pb-secure { color: var(--muted); font-size: .88rem; margin-top: 10px; }
    .btn-lg { font-size: 1.05rem; padding: 12px 22px; }
    .toc { list-style: none; padding: 0; display: grid; gap: 8px; }
    .toc li { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; font-weight: 600; }
    .toc li::before { content: "📘"; margin-inline-end: 8px; }
    .preview h3 { margin: 16px 0 6px; font-size: 1.08rem; }
    .pb-disc { font-size: .85rem; color: var(--muted); border-inline-start: 3px solid var(--line); padding-inline-start: 10px; margin: 18px 0; }
  </style>
<!--/STYLE-->
<!--BODY-->
  <main id="main" tabindex="-1">
    <div class="wrap pb" data-updated="2026-11-14">
      <span class="pb-badge" data-t="badge"></span>
      <h1 data-t="title"></h1>
      <p class="lead" data-t="lead"></p>
      <!--CHECKOUT-->
      <section aria-labelledby="insideT">
        <h2 id="insideT" data-t="insideT"></h2>
        <ul class="toc"><li data-t="ch1"></li><li data-t="ch2"></li><li data-t="ch3"></li><li data-t="ch4"></li><li data-t="ch5"></li><li data-t="ch6"></li></ul>
      </section>
      <section class="card preview" aria-labelledby="previewT">
        <h2 id="previewT" data-t="previewT"></h2>
        <h3 data-t="p1T"></h3><p data-t="p1A"></p>
        <h3 data-t="p2T"></h3><p data-t="p2A"></p>
        <h3 data-t="p3T"></h3><p data-t="p3A"></p>
      </section>
      <p class="pb-disc" data-t="disclaimer"></p>
      <section class="faq" id="faq" aria-labelledby="faqTitle">
        <h2 id="faqTitle" data-t="faqTitle"></h2>
        <details><summary data-t="q1"></summary><div class="answer"><p data-t="a1"></p></div></details>
        <details><summary data-t="q2"></summary><div class="answer"><p data-t="a2"></p></div></details>
      </section>
    </div>
  </main>
<!--/BODY-->
''' + SCRIPT.replace('__T__', json.dumps(G, ensure_ascii=False))
open(R + 'legal-consult.html', 'w', encoding='utf-8').write(consult)
open(R + 'financial-playbook.html', 'w', encoding='utf-8').write(playbook)
print('pages written')
