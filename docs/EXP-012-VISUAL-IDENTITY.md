# EXP-012 — TELLURIS visual identity across the public website

**Date:** 2026-11-15 (America/Costa_Rica)  
**Status:** Implemented on GitHub `main`; public BanaHosting deployment requires separate confirmation.

## User-driven design decision

The user supplied ten presentation-graphic references and the official **Project Uriel Galactic Crest** logo. The resulting user interface deliberately follows their *graphic language* without copying their dense, frame-by-frame animation or producing a decorative poster in place of a working site.

**Visual character:**
- Deep navy (#080D24), off-white (#F6F8FF), cyan (#2DDBE8), measured violet (#806BE5) and rare coral (#FB6A84).
- Large typographic introductions; compact, readable controls and labels in the actual laboratory.
- Thin rules, restrained lines, subtle star motifs and light-weight geometric artwork; no giant neon glow, distracting background motion or extra button clusters.
- Shared navigation/header identity, button styles, selected states and focus indicators across every public page.
- User-supplied Project Uriel crest cropped to its **original star, wings and orbital emblem**, 128 × 106 transparent PNG, 3,593 bytes. The original uploaded image is not overwritten; its distinctive colors are kept. TELLURIS remains the primary product name in the header, with Project Uriel acknowledged as its team.

## Exactly which pages are included

The shared final stylesheet is `website/public/assets/visual-identity.css` with a cache-busted reference on the **12 published HTML routes**:

| Family | Routes |
| --- | --- |
| TELLURIS presentation | `/`, `/en/` |
| Historical canonicalized landing aliases | `/telluris/`, `/en/telluris/`, `/es/`, `/es/telluris/` |
| Team | `/about/`, `/en/about/` |
| NASA science Explorer | `/telluris/explore/`, `/en/telluris/explore/` |
| Scientific catalog | `/telluris/catalog/`, `/en/telluris/catalog/` |

The identity is a thin final layer. It does not replace scientific JavaScript modules or original NASA GIBS images. Source provenance, units, test assumptions, CSV/JSON/PDF tools, USGS seismic and NASA EONET event retrieval are preserved. The 3D scientific map must not be recolored by decorative palette filters; these are limited to the *conceptual illustration on the landing slide*.

## Specific UX correction: Intro slide skip

Slide 00 now exposes **“Saltar presentación · Ir a la última”** / **“Skip presentation · Final slide”**, implemented as a semantic button. It calls the existing slider controller's `change(slides.length-1)` to display slide 05 (final presentation slide). It **does not** directly open the Explorer. The final slide retains the one prominent Explorer CTA. The slider's URL/hash, prior/next control state, inert inactive panels, keyboard interactions, swipe gestures and ES/EN copy are preserved.

## Brand asset / accessibility

`website/public/assets/uriel-symbol-128.png` is derived from the image supplied by the user in this conversation (`Project Uriel Galactic Crest (1).png`), cropped to avoid embedding a large black-square background or repeated wordmark. It is decorative when next to readable “BY PROJECT URIEL” text, with `alt=""`, while the header link retains an accessible descriptive label. The About pages include a larger signature. No new external fonts, image CDNs or third-party JS are needed.

The new design retains visible keyboard focus, muted contrast for secondary text, a reduced-motion media rule and adaptive mobile spacing. Browser acceptance remains important for confirming legibility of deeply nested scientific controls.

## QA and release boundary

- [Chromium UX test after identity update](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43792630373) — **PASS**, bilingual desktop/mobile slide and Explorer navigation, including intro skip to slide 05. Later visual-identity-specific tests check routes and crest dimensions.
- [Source automated QA after route and emblem regressions](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43792857775) — **PASS**; the expanded suite includes 12-page common stylesheet coverage, PNG dimensions, slide 00 skip invariants and unchanged source files. Source tests do not assert scientific validity of every environmental claim.
- No operator command output has confirmed that EXP-012 is live at projecturiel.earth. Review `git fetch/pull --ff-only`, `scripts/deploy-bana-static.sh --check`, expected changed files, backup and `--deploy` only when safe. Confirm all 12 routes in the published browser, paying particular attention to cached CSS and the brand image.

This experiment concerns **appearance and navigation only**. Do not infer a validated climate trend, a seismic hazard model, an official NASA endorsement or a new API from the redesign.
