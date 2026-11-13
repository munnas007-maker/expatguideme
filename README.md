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
