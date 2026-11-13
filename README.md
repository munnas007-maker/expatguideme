# ExpatGuideME

Simple guides and free tools for expats in the Gulf — https://expatguideme.com

## How the site is built
- Page bodies live in `_src/pages/*.html`.
- Shared parts (header, footer, newsletter, search, cookie banner, floating buttons) are added by `_src/build.py`.
- Shared styles and behaviour: `assets/site.css` and `assets/site.js`.

After editing anything in `_src/pages`, run:

    python3 _src/build.py

then commit the generated `.html` files. Netlify deploys every push to `main`.
