# EXP-010 — TELLURIS-first guided journey and Explorer UX audit

**Date:** 2026-11-15 (Costa Rica)  
**Team:** Project Uriel · NASA Space Apps Challenge 2026  
**Status:** GitHub source implementation; production deployment and visual QA require independent confirmation.

## Decision and five-stage judge journey

The root of projecturiel.earth, and the English /en/ variant, now put **TELLURIS before Project Uriel**. Reviewers see the product first, then move through five editorial stages: (1) the scientific question, (2) original-source methodology and limits, (3) four research modes and 18 NASA POWER parameters, (4) confidence/provenance/caveats, and (5) the primary CTA to the real Explorer. The illustrative Earth SVG on the landing is explicitly conceptual, not remotely sensed NASA data.

**Project Uriel** has separate, factual bilingual /about/ and /en/about/ pages highlighting software, integrations, automation, electronics/electrical expertise and documentation. The text avoids inventing team member names, scientific certifications or NASA affiliation. The interactive Explorer and catalog remain separate scientific routes.

## Canonical SEO and preserved URLs

| Canonical route | Role |
| --- | --- |
| / and /en/ | Spanish and English TELLURIS guided product homepage |
| /about/ and /en/about/ | Project Uriel independent team |
| /telluris/explore/ and /en/telluris/explore/ | Original NASA research Explorer |
| /telluris/catalog/ and /en/telluris/catalog/ | Connected variables versus future research candidates |

Legacy /telluris/, /en/telluris/, /es/ and /es/telluris/ still serve the corresponding landing content with a canonical link to the primary locale root, without server-dependent redirects. They are excluded from the eight-entry canonical sitemap. English/Spanish hreflang, Open Graph product imagery and clear site navigation are retained.

The outdated catalog SEO description asserting only two connected NASA variables is corrected to **18 verified connected NASA POWER parameters**. Forty-nine additional topics and ten proposed indicators are catalogued research, not falsely marketed as connected variables.

## Simplification audit

**Removed:** decorative rain and wind canvas, source-event bridge, source module and controls, globe auto-rotation, six redundant question preset buttons, redundant two-zone checkbox in the legacy single-point form, assistant prompt chips and five glossary buttons. The globe retains real NASA GIBS layers, geographic hover labels, manual navigation, zoom and Costa Rica reset.

**Retained behind native disclosures:** original NASA archive, original NASA JSON upload, multi-series JSON/CSV export, full Theil–Sen and conditional Mann–Kendall interpretation, original inference and provenance, GPM import and printable scientific reports. One link opens advanced analysis; four research-mode selectors remain because each controls distinct real functionality.

## Region-A/region-B invariants

- Zone A Liberia removes Liberia entirely from the native Zone B option list (including mobile Safari); Limón remains selectable. Changing Zone A reconstructs B's valid list from a stable source catalog.
- Zone A Limón excludes Limón from Zone B; Liberia remains selectable.
- Switching A between presets automatically moves B to the other preset only if it would otherwise collide.
- Zone A custom coordinates identical to a known preset exclude that named B option too.
- Identical custom coordinate pairs are rejected **before** a NASA request, regardless of labels.
- Changes to region, coordinates, variable, years or mode cancel stale requests and invalidate old results.
- Original NASA source data is retained in its actual unit and geographic grid, not claimed to describe entire provinces.

Pure location rules live in website/public/assets/site-choice.js with test coverage in website/tests/site-choice.test.js. Multi-parameter source verification, pair-year matching and scientific inference remain in EXP-009.

## Evidence discipline

Only real NASA POWER source series and NASA GIBS mapped images are used for source-backed output. The data-completeness gate remains 12/12 original months per annual record; original source verification for 1985–2025 returned **34 full 41-year series and two 25-year albedo series** across Liberia and Limón (EXP-009 original NASA probe #43773261601). Numeric slopes are descriptive, do not establish causation, and tests of temporal independence/significance remain conditional; many-variable scans need multiplicity control. The evidence assistant is **deterministic**, not a connected generative LLM.

## Test and release gates

- Latest green static source suite before the new real-browser runner: GitHub Actions #43783705817, including original NASA/science tests and site/UI source checks. Later site QA runs extend this with all-page internal links and canonical SEO checks.
- Browser acceptance runner: .github/workflows/exp010-browser-qa.yml, tests/browser-smoke.mjs. It covers ES/EN, team pages, A/B duplicate prevention, archived matrix, advanced scientific disclosure, desktop/mobile widths and screenshots. External imagery is blocked intentionally to exercise fallback, so this test must never be cited as proof of correctly rendered NASA GIBS texture georegistration in production.
- The static site is controlled by the user-owned BanaHosting deployment. GitHub edits alone are not live. Use the existing backed-up, HTTPS-audited scripts/deploy-bana-static.sh --check and --deploy sequence only after source QA and official NASA submission readiness. The incremental deployment does not delete unreferenced prior assets such as public assets/globe-weather.js, which is no longer loaded and requires separately authorized cleanup.

## Contest presentation integrity

Do not present Project Uriel as an official NASA organization, imply NASA endorsement, invent precise station-level accuracy, claim causal explanations, advertise real-time weather, or claim an unconnected generative assistant. All documentation and code changes retain English Conventional Commit history. See EXP-009-OBSERVATORY.md, SCIENTIFIC-METHODOLOGY.md, DATA-SOURCES.md, SUBMISSION.md and VALIDATION.md for scope and audit trail.

## Recorded EXP-010 CI and real-browser acceptance — 2026-11-15

- [Static GitHub source suite #43784411416](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43784411416): **117/117 Node test cases PASS** with JavaScript syntax/localhost HTTP checks.
- [Real Chromium test #43784411387](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43784411387): **PASS** ES/EN guided landing, dedicated team About, original-source archivally-backed Observatory, bidirectional known-site exclusion, custom coordinate alias exclusion and exact custom duplicate prevention, advanced disclosure navigation, 1440px/390px horizontal-overflow checks and image artifacts.
- The Chromium browser acceptance tests **intentionally block external jsDelivr and NASA GIBS** to validate a usable geographic/browser fallback. They **do not** verify public texture appearance or live source image georegistration.
- More explicit browser regression checks subsequently cover the four distinct one/two-variable and one/two-site research mode transitions. Capture the final passing Action run separately.
- **BanaHosting release remains unverified** until a user/operator executes a successful backed-up --deploy and confirms visible product-first pages and source integrity.


## Safari-compatible native selector hardening

Following the browser/static acceptance tests, the secondary zone selector was strengthened: when A selects a named location or a custom coordinate equivalent to it, the matching B option is **not rendered in the native select at all**. This avoids platform differences in how hidden/disabled options appear in mobile Safari. The complete available option catalog is retained in JavaScript and recreated on each A change, preserving B's previous legitimate selection and a custom-coordinate option. The geographic-duplicate validator remains an independent pre-request guard for custom/custom duplicates. Browser tests now assert **absence** of excluded B options, not merely disabled styling.
