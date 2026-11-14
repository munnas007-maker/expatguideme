# ExpatGuideME

Simple guides and free tools for expats in the Gulf — https://expatguideme.com

## How the site is built
- Page bodies live in `_src/pages/*.html`.
- Shared parts (header, footer, newsletter, search, cookie banner, floating buttons) are added by `_src/build.py`.
- Shared styles and behaviour: `site/assets/site.css` and `site/assets/site.js`.
- Netlify publishes the `site/` folder. The community rate API lives in `netlify/functions/rates.mjs`.

After editing anything in `_src/pages`, run:

    python3 _src/build.py

then commit the generated `.html` files in `site/`. Netlify deploys every push to `main`.

## Languages and translated pages

English pages live at the site root. Every other language (Arabic, Hindi,
Malayalam, Nepali, Urdu, Bengali) gets its own folder, for example
`site/bn/send-money.html`, with its own title, description, canonical
address and hreflang links. `python3 _src/build.py` builds the English pages,
then runs `node _src/prerender.cjs` to create the translated copies, and
finally writes `sitemap.xml` with every language version.

Before the first build on a new computer, run `npm install` once (it installs
jsdom, which the translator uses).
