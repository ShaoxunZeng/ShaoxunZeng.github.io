# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Project Overview

Personal academic website for Shaoxun Zeng (shaoxunzeng.github.io), hosted on GitHub Pages. The site uses a hybrid static/dynamic rendering approach: `js_index.html` is the editable source template, and `index.html` is the pre-rendered static output served to users.

## Build

**Prerequisites** (one-time setup):
```bash
pip3 install pytest-playwright playwright
playwright install chromium
```

**Build command:**
```bash
# render.py requires a local HTTP server to be running first:
python -m http.server 8000 --bind 127.0.0.1 &
python render.py
```

Note: use `python` (not `python3`) on Windows. The server must be running before `render.py` is invoked because Playwright fetches `js_index.html` via HTTP.

The build script uses Playwright (headless Chromium) to render `js_index.html` with JavaScript executed, then writes the result to `index.html` and updates `sitemap.xml` with the current date.

**Local development preview:**
```bash
python -m http.server 8000 --bind 0.0.0.0
# Then open http://localhost:8000/js_index.html
```

Use `js_index.html` for live development (dynamic JS), then run the build to regenerate `index.html` for production.

## Architecture

### Two-file rendering pattern
- **`js_index.html`** — the source of truth for page structure and content; loads `script.js` to dynamically render publications
- **`index.html`** — auto-generated static output; do not edit directly
- **`script.js`** — fetches `papers/publications.json` and builds the publication list DOM at runtime; stripped from the output during build

### Content data
- **`papers/publications.json`** — single source of truth for all publications. Each entry has: `title`, `authors` (array), `venue`, `short`, `year` (integer), `link`, and optional `code` and `award` fields. Publications are grouped by year (descending) in the rendered output. The author "Shaoxun Zeng" is bold/highlighted automatically.
- `year` must be an integer (not a string). `link` and `code` should be a URL string or `null`; omitting them is also acceptable.
- Awards shorter than 30 characters are displayed inline after the venue; longer awards appear on a new line below.
- Papers with no `link` render the title as plain text (no `<a>` tag); do not use `"link": ""` as a substitute for no link — use `null` or omit the field.

### Styling
- **`style.css`** — single custom stylesheet, no CSS frameworks or external dependencies. Responsive via media queries at 567px, 768px, and 1200px.
- CSS class for blue-colored links/tags is `.blue-tag` (not `.bule-tag`).

### SEO metadata
`js_index.html` contains JSON-LD schema.org markup, Open Graph tags, and Twitter Card tags. The sitemap (`sitemap.xml`) is auto-updated with each build. After building, submit the sitemap to Google Search Console and Bing Webmaster Tools if significant content was added.

## Key workflow

To update publications: edit `papers/publications.json`, then run `bash build.sh` to regenerate `index.html`.

To update page content (bio, research section, links, etc.): edit `js_index.html`, then run `bash build.sh`.

Never manually edit `index.html` — it is overwritten on every build.

Education content check (2026-09-20): removed the redundant `Education:` paragraph from [js_index.html](js_index.html), keeping the section heading. Browser checks passed for both the template and generated [index.html](index.html): one Education heading, three education entries, and all nine publications.
