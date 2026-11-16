# EXP-016 — Dynamic, source-backed opening instead of a new video

**Date:** 2026-11-15 (Costa Rica). **Status:** GitHub implementation; production BanaHosting requires operator deployment and public QA.

## User decision

Instead of creating the proposed additional EXP-015 Remotion film, communicate its core scientific **problem → genuine evidence → future potential** directly on **slide 00** of the existing six-slide bilingual TELLURIS website.

The opening is **interactive HTML/CSS/JavaScript**, with optional motion only, no audio and no autoplay. It retains the original Project Uriel logo, existing conceptual globe and six-slide navigation, including the **Skip presentation → final slide** button. No existing source investigation or closing video is modified. No MP4 or external library is introduced.

## What the user sees

1. **The problem:** more Earth observations do not automatically establish causal and physical truth. Introduces source quality, variability and independent scientific checks.
2. **Actual evidence:** the 41 real annual NASA POWER/MERRA-2 T2M values for model-grid samples near Liberia and Limón (1985–2025) from the committed [EXP-001 archived series](../website/public/telluris/explore/data/exp001-annual.json). Shared °C axis; descriptive Theil–Sen slopes rounded **−0.113 °C/decade** (Liberia) and **+0.168 °C/decade** (Limón). Explicitly **not** validated climate significance. The plot appears only after authentic archive data passes schema, year and finite-value checks; failure displays a clear source-unavailable state, never a fake curve.
3. **Potential uses:** research into vegetation, water and early environmental context for Earth-based scientific field experiments — labeled as **future** (not currently connected to NASA site-selection methods, mission certification or live launch weather). No earthquake prediction or operational NASA affiliation is implied.

URI is an understated original geometric evidence-navigation cue, not a NASA mascot or source of scientific facts. All transitions are user-directed, keyboard operable, with reduced-motion support. Browser SVG remains text-readable and exports/real NASA studies remain in the full Explorer.

## Architectural boundaries

- Code: `website/public/assets/hero-case.js` is a zero-dependency ES module; `hero-case.css` remains separate from the existing visual identity.
- The only plotted source is the same checked-in NASA archive used by the Explorer; the module renders no data series if fetching or validation fails.
- All six landing aliases receive matching ES/EN HTML. Original scientific algorithms, backend, API endpoints, catalog and EXP-013 Observatory are untouched.
- The EXP-015 29.4-second **new film proposal is superseded for the website intro**; the media design brief remains in Git history but no new film is necessary for the present interaction. The existing brand film may be placed separately later with its own media QA.
- No automatic deployment, no official NASA video/submission claim.

## Release verification

- [x] Structural, source parity and source-rejection tests passed in [static QA #43806192154](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43806192154): 141 passed, 0 failed.
- [x] Original website, data and science suites passed unchanged: [141/141 in static QA #43806192154](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43806192154).
- [x] Chromium ES/EN desktop/mobile user journeys, story buttons, 41 source points per plotted series, preserved slide 00 skip and responsive no-overflow passed in [browser QA #43806238639](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43806238639); [ ] separate manual screen-reader and source-error states.
- [ ] Public BanaHosting ES/EN routes verified through audited backup/deploy script separately.
- [ ] Official NASA submission status verified separately.

See [EXP-001](EXPERIMENT-001.md), [EXP-005](EXP-005-SIGNIFICANCE.md), [judge evidence case](JUDGES-EVIDENCE-CASE-2026.md), and [EXP-015 prior video concept](EXP-015-VIDEO-EVIDENCE-AND-VISION.md).

### EXP-016 implementation verification notes

The first Chromium run [#43805947132](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43805947132) found a legacy CSS rule hiding the full right-side figure below 560px, including the evidence plot. Corrected the mobile selector in `cfdac99` (source plot now visible when selected), and made browser QA trigger automatically for future homepage/asset changes in `d4ac9e3`. [Chromium run #43806238639](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43806238639) subsequently passed. The static suite [#43806192154](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43806192154) passed **141 tests / 0 failures**. Production BanaHosting was **not** deployed by Actions (the opt-in deploy job was skipped). No video file was created or installed.
