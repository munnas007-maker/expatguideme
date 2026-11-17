# ExpatGuideME

Simple guides and free tools for expats in the Gulf — https://expatguideme.com

## How the site is built
- Page bodies live in `_src/pages/*.html`.
- Shared parts (header, footer, newsletter, search, cookie banner, floating buttons) are added by `_src/build.py`.
- Shared styles and behaviour: `site/assets/site.css` and `site/assets/site.js`.
- GitHub Pages publishes the `site/` folder through `.github/workflows/update-rates.yml` (every push to `main`; every 2 hours it refreshes exchange rates, gold and checked provider rates; the 07:15 Riyadh run also pings IndexNow).
- Forms are sent by email through FormSubmit (`_src/data/site.json` → `form_endpoint`). Community rate sharing on Send Money is off until `rates_api` is set.
- Bank card offers page: data in `_src/data/offers.json` (updated by a scheduled Claude task), page made by `python3 _src/generators/build_offers_page.py`.
- Money settings live in `_src/data/`: `partners.json` (Send via links, sponsored flag), `essentials.json` (footer card), `products.json` (Playbook checkout).

After editing anything in `_src/pages`, run:

    python3 _src/build.py

then commit the generated `.html` files in `site/`. GitHub Actions rebuilds and publishes every push to `main`.

## Languages and translated pages

English pages live at the site root. Every other language (Arabic, Hindi,
Malayalam, Nepali, Urdu, Bengali) gets its own folder, for example
`site/bn/send-money.html`, with its own title, description, canonical
address and hreflang links. `python3 _src/build.py` builds the English pages,
then runs `node _src/prerender.cjs` to create the translated copies, and
finally writes `sitemap.xml` with every language version.

Before the first build on a new computer, run `npm install` once (it installs
jsdom, which the translator uses).
