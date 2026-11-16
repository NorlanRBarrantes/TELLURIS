# EXP-015 — NASA evidence film, credible future applications and URI narrative character

**Reviewed:** 2026-11-15 (Costa Rica)  
**Status:** Creative specification + research decision, **NOT a rendered video or production website feature**. No spacecraft launch-authorization or NASA partnership is claimed.

## Creative direction — one proven example, a broader potential

The first 30-second film should establish a **real, reproducible research case** before presenting possible future uses. Do not begin by promising drought prediction, earthquake forecasting, rocket-launch decisions or mission site certification. The common platform capability is **source-grounded environmental exploration**, not an unbuilt operational decision engine.

### What TELLURIS can show now

- Authentic NASA POWER / MERRA-2 monthly source records, 1985–2025, 41 complete calendar years each for two model/grid samples near Liberia (10.63 N, −85.44 W) and Limón (9.99 N, −83.03 W), **T2M** and **PRECTOTCORR**. Original source response fingerprints and retrieval [EXP-001](EXPERIMENT-001.md).
- Descriptive **Theil–Sen T2M estimates**: Liberia **−0.11268630 °C/decade**, Limón **+0.16786322 °C/decade** (display −0.113, +0.168). These are slopes, not differences between endpoints nor physical climate forecasts.
- Exploratory confidence limits: Liberia **[−0.228, +0.008]** °C/decade (includes zero); Limón **[+0.109, +0.234]** °C/decade, *conditional on assumptions*. Serial dependence and source inhomogeneity are not established. The original Mann–Kendall p-values cannot be promoted to validated climate significance.
- Rainfall PRECTOTCORR trends are extraordinarily large; **source consistency requires independent GPM/gauge checks**. The film should not use these amounts as proven local precipitation changes. If shown, label them "Source validation needed".
- Original Limón MODIS 250 m terrestrial-vegetation candidate contained mostly shoreline/shallow-ocean flags, and the team rejected that pixel for strict land-only vegetation analysis. This real negative QA finding is a powerful demonstration of scientific integrity; it is **not** a validated vegetation trend or a public MODIS connector.

### What the technology might support in future (not existing science modules)

1. **Climatology and water:** educational, evidence-bound trend exploration, with independent rainfall, gauge and hydrological products before real water decisions.
2. **Vegetation and ecosystem investigations:** pre-screen candidate study locations with land-cover/vegetation products and pixel QA; validate actual NDVI/EVI time series in an independent future release.
3. **Seismology and hazards:** the present USGS explorer displays reported event catalogs; it cannot predict earthquakes, assign engineered site safety, or infer climate–earthquake causality.
4. **Earth analog and instrument-testing research:** meteorological and vegetation context could **help researchers preliminarily characterize candidate locations** for terrestrial scientific field work, robotics or planetary-analog studies, provided terrain/geology, protected-area permissions, ground measurements and mission-specific constraints are independently checked. No selected/tested NASA site in Costa Rica is claimed.
5. **Aerospace ground tests or candidate launch-area *climatology*:** historical seasonal wind/rain/temperature distributions could be preliminary context in a future, specially validated workflow. They are **not real-time weather, no-go/go criteria, launch weather predictions, upper-air wind shear, lightning radar, environmental impact assessment, or certification**. NASA launch teams use dedicated operational meteorology and strict constraints.

**Verified context**: NASA POWER source methodology explains reanalysis and product grid characteristics; NASA and USGS document planetary analog site field tests; NASA Kennedy launch weather systems use radar/wind/lightning infrastructure; USGS explicitly states major earthquakes cannot be predicted.

- NASA POWER method: https://power.larc.nasa.gov/docs/methodology/
- NASA planetary analogs: https://science.nasa.gov/solar-system/planetary-analogs/
- NASA analog missions: https://www.nasa.gov/analog-missions/
- NASA Kennedy weather and range technology: https://www.nasa.gov/kennedy/partnerships/weatherandrangetechnology/
- NASA Crew Dragon weather criteria: https://www.nasa.gov/wp-content/uploads/2021/07/falcon9_crewdragon_launch_weather_criteria_fact_sheet.pdf
- USGS seismic forecasting limits: https://www.usgs.gov/faqs/can-you-predict-earthquakes

## URI — original motion-graphics character

**Name (working):** URI — "the evidence navigator". URI is a small, original, friendly but sophisticated geometric guide derived *visually* from the Project Uriel palette, **not** a NASA employee, planetary mascot, astronaut in NASA insignia, or a speaking source of facts.

- Shape: a compact asymmetrical orbit/prism character with subtle expressive eye/lens, tiny analytical line trails, restrained cian/violet highlights and dark navy contours.
- Art direction: premium minimal 2D vector motion graphics; *not* photorealistic, manga, cartoon child style, generic chatbot avatar, or logo redesign. Keep the existing **Project Uriel** symbol untouched.
- Narrative action: introduces a question, scans two map points, hands off to an actual NASA time-series plot, puts a visible **caution marker** on the difference between trend and scientific proof, opens small conceptual cards for future research, exits through the brand ending.
- UI priority: <15% of visual area, never overlaps data labels, plotted points, disclaimers, captions or source credits. Character may emote curiosity, never portray statistical certainty or speak invented numerical values.
- Audio: off by default on web; external English narration, synchronized English and Spanish caption exports; silent nonautoplay poster on 00.

## Film architecture

**Two separate films in the public 6-slide journey, not one 60-second submission:**

- **Slide 00 / case:** new **29.4 s @30 fps (882 frames)** authentic-data film with URI, named NASA source, actual T2M chart, limited conclusion, then a constrained future-research glimpse. Place a user-initiated player in the existing intro slide; preserve the original fast "Skip to last slide" control and navigation.
- **Slide 05 / identity:** supplied original `WhatsApp Video 2026-11-15 at 8.10.27 PM.mp4`, **1920×1080 30 fps, 30.066667 s**, original motion graphics branded TELLURIS and explicitly *illustrative* curves. Keep as secondary aspirational closing video with accessible controls. This file is a user-supplied local attachment **not present in GitHub**; the developer/creator must provide it to the Remotion workspace or import it as an asset. Do not invent its location or commit it without permission and licensing review. The original movie slightly exceeds the <=30 s official video limit; if officially used, trim it to 29.4 s with audio/caption checks.
- **Official 2026 NASA demo:** one self-contained <=30.0 s film (recommend the **real-data** opener), not both sequential videos. The public website may offer both independently. Confirm exact applicable submission rules in the live portal and final render duration with ffprobe.

## 29.4 s original-data narrative

| Time | Data or artwork | Narration goal |
| --- | --- | --- |
| 00.0–03.5 | URI materializes, accurate schematic of Costa Rica with two clearly labeled points | Ask whether nearby locations can tell different observational stories |
| 03.5–07.0 | NASA POWER / MERRA-2, 1985–2025, 41 annual observations per series; not station data | Establish genuine input and source provenance |
| 07.0–13.0 | Load/animate **real 41-point T2M series for each site** from committed JSON; mark −0.113 and +0.168 °C/decade descriptive slopes with fixed common axes | Show an actual measurable contrast and method |
| 13.0–17.0 | URI points to confidence/assumption warning, briefly show Liberia interval crossing zero | A trend is a question and a clue, not scientific proof |
| 17.0–22.5 | Show original MODIS shoreline QA failure concept as separate *experiment* OR a clear source limitation, without inventing raster values | Scientific method includes rejecting unreliable observations |
| 22.5–26.5 | Simple **future potential** cards: ecosystems, water, environmental context for Earth analog tests; do NOT depict a spacecraft launch approval | Broaden impact accurately |
| 26.5–29.4 | Character folds into Project Uriel identity; TELLURIS title and "Investigate Earth. Question the evidence." | Brand payoff and invitation to use the actual Explorer |

**English voiceover draft (approx. 62 words, ~25–28 s depending on pacing):**

> “Two places. Forty-one years. One question: what is really changing? NASA data near Liberia and Limón show different estimated temperature trends. But a trend is not proof. TELLURIS helps us examine the observations, test assumptions, and spot uncertainty. From climate to vegetation and future Earth-based research, better evidence opens new possibilities. TELLURIS. Question the data. Understand the Earth.”

Spanish subtitle track must be accurate and naturally localized; captions should not invent extra spoken facts. All numeric on-screen content derives only from the repository's original NASA archive and checked calculations.

## Critical audiovisual integrity

- Actual plot annual years and values must come from `website/public/telluris/explore/data/exp001-annual.json`. Use the true time axis, real geographic coords and verified source labels. No fabricated curves, extra "NASA" sample, faux mission approval, fake station maps, spurious local impact scoring, or charts that swap real units.
- Show descriptive slope labels with all digits properly rounded and "exploratory/source grid" caveat readable for at least 2 seconds.
- Avoid precip chart inference unless explicitly showing **unverified** source anomaly and scientific validation need.
- Place a small footer on the last research frame: "NASA POWER / MERRA-2 | 1985–2025 | source-grid estimates | exploratory analysis".
- Preserve original logo color, avoid unlicensed NASA symbols/missions, include credits. Original characters/music/assets should be created in code or appropriately licensed.
- Use Remotion SVG paths, frame-driven animation and deterministic seed. Provide 16:9, H.264 MP4, transparent static URI illustration assets and readable ES/EN SRT or VTT tracks. Make the film comprehensible with sound off.
- For website embedding: do not autoplay audio, pause/halt videos on slide change, prevent dual playback, leave the "Skip presentation → final" functionality intact, handle missing media, lazy-load, use native accessible controls and accessible transcripts. Check mobile, performance, keyboard, and reduced-motion behavior. No hardcoded private API keys.
- Static website on BanaHosting: no Node process or Remotion runtime required for viewing — render and commit/copy only optimized final media when produced and approved.

## Verification gates

1. Source schema, exact original 41 rows per location, year range, finite values, source provenance and input hashes.
2. All text/numeric overlays checked with [EXP-001](EXPERIMENT-001.md) and [EXP-005](EXP-005-SIGNIFICANCE.md).
3. ffprobe duration <=29.5 s (chosen 29.4), 1920x1080, 30 fps; audio track present only if intentionally supplied; caption sync verified.
4. Data chart compared programmatically against JSON (every plotted point; no mutation of data).
5. ES/EN site, mobile/desktop no overflow, poster fallback, keyboard controls, pause on slide change, navigation/skip unaffected.
6. NASA submission follows its live portal; do not imply website film publication equals official submission.

### Evidence QA addendum

The unrelated EXP-014 removal of the dead-end AI CTA has both [passing static source tests](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43799927204) and [passing Chromium attempt 2](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43799927195). Neither run renders, publishes or validates the planned EXP-015 films.
