/*
 * Builds the translated copies of every page: site/<lang>/<page>.html
 *
 * For each English page built by build.py, the page is opened in a headless
 * browser (jsdom) in the target language, and the translated text of every
 * element marked with data-t / data-s is copied into a clean copy of the page.
 * The result is a static page that search engines can read in that language,
 * with its own <title>, description, canonical address and internal links.
 *
 * Usage: node _src/prerender.cjs '<json list of {file, path}>'
 */
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = path.resolve(__dirname, "..");
const SITE = path.join(ROOT, "site");
const SITE_URL = "https://expatguideme.com";
const LANGS = ["ar", "hi", "ml", "ne", "ur", "bn", "tl"];
const RTL = { ar: true, ur: true };
const siteJs = fs.readFileSync(path.join(SITE, "assets", "site.js"), "utf8");
const pages = JSON.parse(process.argv[2] || "[]");

// FAQPage structured data built from the visible questions on the page, in the page's language.
function faqSchema(A) {
  A.querySelectorAll('script[data-faq-schema]').forEach((n) => n.remove());
  const items = [];
  A.querySelectorAll(".faq details").forEach((d) => {
    const q = ((d.querySelector("summary") || {}).textContent || "").replace(/\s+/g, " ").trim();
    const a = ((d.querySelector(".answer") || {}).textContent || "").replace(/\s+/g, " ").trim();
    if (q && a) items.push({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } });
  });
  if (!items.length) return;
  const sc = A.createElement("script");
  sc.setAttribute("type", "application/ld+json");
  sc.setAttribute("data-faq-schema", "");
  sc.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items }).replace(/</g, "\\u003c");
  A.head.appendChild(sc);
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function shorten(text, max) {
  text = (text || "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return (sp > max * 0.6 ? cut.slice(0, sp) : cut) + "…";
}

async function render(file, pagePath, lang) {
  const raw = fs.readFileSync(path.join(SITE, file), "utf8");
  const clean = new JSDOM(raw);
  const A = clean.window.document;
  const marked = A.querySelectorAll("[data-t],[data-s],[data-s-ph],[data-s-aria]");
  marked.forEach((el, i) => el.setAttribute("data-pr", String(i)));
  A.documentElement.setAttribute("data-page-lang", lang);

  const tagged = clean.serialize().replace('<script src="/assets/site.js"></script>', "<script>" + siteJs + "</script>");
  const vc = new VirtualConsole();
  const errors = [];
  vc.on("jsdomError", (e) => errors.push(e.message));
  const live = new JSDOM(tagged, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: SITE_URL + (lang === "en" ? "" : "/" + lang) + pagePath,
    virtualConsole: vc,
    beforeParse(w) {
      const store = {};
      Object.defineProperty(w, "localStorage", { value: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } } });
      w.matchMedia = () => ({ matches: false, addEventListener() {}, addListener() {} });
      w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = () => {};
      w.fetch = () => Promise.resolve({ ok: false, status: 503, json: () => Promise.resolve({}), text: () => Promise.resolve("") });
    }
  });
  await sleep(150);
  const B = live.window.document;
  if (errors.length) throw new Error(file + " [" + lang + "]: " + errors.join(" | "));

  B.querySelectorAll("[data-pr]").forEach((src) => {
    const dst = A.querySelector('[data-pr="' + src.getAttribute("data-pr") + '"]');
    if (!dst) return;
    if ((src.hasAttribute("data-t") || src.hasAttribute("data-s")) && src.textContent.trim()) dst.textContent = src.textContent;
    if (src.hasAttribute("data-s-ph") && src.getAttribute("placeholder")) dst.setAttribute("placeholder", src.getAttribute("placeholder"));
    if (src.hasAttribute("data-s-aria") && src.getAttribute("aria-label")) {
      dst.setAttribute("aria-label", src.getAttribute("aria-label"));
      dst.setAttribute("title", src.getAttribute("aria-label"));
    }
  });
  A.querySelectorAll("[data-pr]").forEach((el) => el.removeAttribute("data-pr"));

  faqSchema(A);
  if (lang === "en") {
    fs.writeFileSync(path.join(SITE, file), clean.serialize());
  } else {
    const html = A.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", RTL[lang] ? "rtl" : "ltr");

    const h1 = (B.querySelector("h1") || {}).textContent || "";
    const lead = (B.querySelector(".lead") || B.querySelector(".lang-note") || {}).textContent || h1;
    if (h1.trim()) A.title = shorten(h1, 70) + " | ExpatGuideME";
    const desc = A.querySelector('meta[name="description"]');
    if (desc && lead.trim()) desc.setAttribute("content", shorten(lead, 158));
    const canon = A.querySelector('link[rel="canonical"]');
    if (canon) canon.setAttribute("href", SITE_URL + "/" + lang + pagePath);

    A.querySelectorAll("a[href^='/']").forEach((a) => {
      const h = a.getAttribute("href");
      if (/^\/(assets|api)\//.test(h) || /\.(xml|txt|png|svg|ico)$/.test(h)) return;
      a.setAttribute("href", "/" + lang + h);
    });

    const outDir = path.join(SITE, lang);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, file), clean.serialize());
  }
  live.window.close();
  clean.window.close();
}

(async () => {
  for (const p of pages) {
    for (const lang of LANGS) await render(p.file, p.path, lang);
    await render(p.file, p.path, "en");
    console.log("translated", p.file, "→", LANGS.join(", "), "+ en");
  }
})().catch((e) => { console.error(e.message || e); process.exit(1); });
