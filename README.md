# Saiba Hair Salon & Spa — Website

A single-page static site for Saiba Hair Salon & Spa (Lexington, MA). No build step, no framework — plain HTML, CSS, and JavaScript, ready to deploy to any static host (GitHub Pages, Netlify, etc.).

## Folder structure

```
saibasalon/
├── index.html                 ← deployment entry point (the whole site)
├── admin/
│   ├── index.html             ← admin portal shell (Netlify Identity + Decap CMS)
│   └── config.yml              ← CMS content model (what's editable, validation rules)
├── _data/                     ← content published through the admin portal
│   ├── contact.json  about.json  services.json  team.json  testimonials.json  gallery.json
├── assets/
│   ├── css/
│   │   └── styles.css         ← all site styles (extracted from index.html)
│   ├── js/
│   │   ├── nav.js             ← hamburger menu / drawer nav toggle
│   │   ├── services.js        ← services grid, category detail view, Products brand grid
│   │   └── cms-loader.js      ← loads _data/*.json and safely patches the page (falls back to hardcoded content if a file is missing)
│   └── images/                ← every photo, logo, and icon the site uses
├── archive/                    ← unused legacy files, excluded from git (see below)
├── netlify.toml                ← security headers + admin-route hardening
├── SETUP.md                    ← one-time Netlify dashboard steps to activate the admin portal
├── README.md                  ← this file
└── .gitignore
```

## Admin portal (saibasalon.com/admin/)

The site now has a content editor at `/admin/`, authenticated through
Netlify Identity and publishing through Netlify Git Gateway (no passwords
or tokens live in this repo). See **SETUP.md** for the one-time setup steps
you need to do in the Netlify dashboard before it's usable, and for how
publishing, preview, and revert work day to day.

Everything under `assets/` is referenced from `index.html` with plain relative paths (e.g. `assets/css/styles.css`, `assets/images/hero-logo-desktop.png`). There are no absolute `/...` paths and no `file:///...` paths anywhere, so the site works the same whether it's opened locally, hosted at the root of a domain, or hosted under a subpath like `https://username.github.io/reponame/`.

### `archive/` — files not used by the live site

These were already in the project folder before the reorganization. None of them are linked from `index.html`, and `archive/` is now listed in `.gitignore` so it is never pushed to GitHub or published by Netlify:

- `Index_down.html` — an old "Coming Soon" placeholder page.
- `admin-index.html`, `config.yml` — an old, unmaintained Netlify CMS admin panel (superseded by the real `admin/` + `_data/` setup described above — do not restore or link to these).
- `about.json`, `contact.json`, `gallery.json`, `services.json`, `team.json`, `testimonials.json` — old CMS content files with stale placeholder data (e.g. a fake phone number) — not used by the live `_data/` files.
- `Saiba_Logo_Champagne_Gold.png` / `.svg` — a standalone logo export, not embedded in the page.

You can safely delete `archive/` entirely, or keep it around for reference — it has no effect on the deployed site either way, and it's excluded from version control. **If `archive/` was ever committed to the GitHub repo before this exclusion was added, remove it from the repo's history too** — see SETUP.md, Step 1.

`.DS_Store` (a macOS Finder file) was left at the project root since it's harmless there and is now excluded via `.gitignore`, so it won't get committed to GitHub regardless.

## Previewing locally

Because the page loads its own CSS/JS/images via relative paths, opening `index.html` directly in a browser (double-click, or `file://...`) works for a quick look, but some browsers restrict `fetch()` on the `file://` protocol. To preview exactly as it will behave when deployed, serve the folder over local HTTP instead:

```bash
cd saibasalon
python3 -m http.server 8000
# then open http://localhost:8000/ in your browser
```

(Any static server works — `npx serve`, VS Code's "Live Server" extension, etc.)

## Deploying to GitHub Pages

1. Create a new GitHub repository and push this folder's contents to it (commit `index.html`, `assets/`, `README.md`, and `.gitignore`; skip `archive/` if you don't want the legacy files in version control).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick the branch (e.g. `main`) and folder **`/ (root)`**.
4. Save. GitHub will publish the site at `https://<username>.github.io/<reponame>/` within a minute or two.

No build step is required — GitHub Pages serves the static files as-is.

## Known loose ends (not fixed, flagged for you)

- **`archive/` files** listed above are unused by the live page and excluded from git. Let me know if you'd like them removed entirely.
- This whole setup (Identity + Git Gateway) only works because the site is hosted on Netlify. If you ever move hosting off Netlify, the admin portal will need a different backend — ask before assuming any static host will "just work" for this.

## What changed from the original single file

`index.html` previously contained ~3.9 MB of inline `<style>` CSS, three inline `<script>` blocks, and 25 images embedded as base64 `data:` URIs. All of that has been extracted into the `assets/` files described above — the page's appearance, layout, animations, and interactions (drawer nav, service tile ⇄ detail swap, Products brand grid, Book Now links, sticky utility bar) are unchanged.
