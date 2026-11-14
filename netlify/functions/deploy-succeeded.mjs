// Runs automatically after every successful Netlify deploy (event-triggered function).
// Pings IndexNow so Bing, ChatGPT Search, Yandex, Seznam and Naver re-crawl the pages
// that changed today. Only production deploys of expatguideme.com are pinged.
const HOST = "expatguideme.com";
const KEY = "66cdcf034120def49b85661775030511";

export const handler = async (event) => {
  let deploy = {};
  try { deploy = (JSON.parse(event.body || "{}").payload) || {}; } catch (e) {}
  if (deploy.context && deploy.context !== "production") {
    return { statusCode: 200, body: "skipped: " + deploy.context };
  }
  // Give the CDN a moment to serve the new files.
  await new Promise((r) => setTimeout(r, 5000));
  const xml = await fetch("https://" + HOST + "/sitemap.xml", { headers: { "cache-control": "no-cache" } }).then((r) => r.text());
  const today = new Date().toISOString().slice(0, 10);
  const all = [];
  const fresh = [];
  for (const m of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) {
    all.push(m[1]);
    if (m[2] >= today) fresh.push(m[1]);
  }
  const urlList = (fresh.length ? fresh : all).slice(0, 10000);
  if (!urlList.length) return { statusCode: 200, body: "no urls" };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: "https://" + HOST + "/" + KEY + ".txt", urlList })
  });
  console.log("IndexNow", res.status, urlList.length, "urls");
  return { statusCode: 200, body: "IndexNow " + res.status + " for " + urlList.length + " urls" };
};
