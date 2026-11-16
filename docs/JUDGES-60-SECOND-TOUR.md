# TELLURIS — A 60-second evidence-first judge tour

**Team:** Project Uriel  
**Challenge:** [Be An Earth System Trend Detective!](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)  
**Date:** 15 November 2026 (Costa Rica)  
**Scope:** A reproducible Earth-system *trend investigation*, not a weather forecast, hazard-warning service, or NASA-endorsed product.

## One-sentence proposition

**TELLURIS helps people investigate what is changing on Earth, where and by how much — while showing the NASA source evidence, statistical assumptions, and when a conclusion is *not* justified.**

## 60-second demonstration script

| Time | Show or explain | What is actually supported |
| --- | --- | --- |
| 0–10 s | **Problem:** More Earth data do not automatically mean trustworthy conclusions. | A trend line, a low unadjusted p-value, or a visually attractive map cannot establish causation. |
| 10–25 s | **Choose real evidence:** Open TELLURIS and the archived Liberia–Limón temperature investigation. | 41 complete calendar years (1985–2025), original NASA POWER/MERRA-2 monthly input aggregated to annual air-temperature observations for **two source-grid samples**, not citywide thermometer measurements. |
| 25–38 s | **Compare honestly:** Liberia versus Limón, Theil–Sen descriptive trends. | Liberia **−0.113 °C/decade**; Limón **+0.168 °C/decade**. The source and numerical reconstruction are documented. These numbers **are not independently validated physical climate attribution**; they do not prove a statistically significant difference between the two slopes. |
| 38–50 s | **Show scientific judgment:** Explain the rejected MODIS vegetation point. | At the original Limón coastal point, **67** MOD13Q1 records were shoreline/coast-coded and **2** shallow-ocean-coded, with **0** unequivocal land flags in the 69 inspected composites. This point could not support an unambiguous terrestrial vegetation claim. This is a **documented research QA case**, not a live vegetation-trend function. |
| 50–60 s | **Why it matters:** An accessible ES/EN investigative workflow that links data, comparisons, exploratory tests, caveats, and exports. | Four investigation modes and 18 NASA POWER parameters are implemented in source. The archived 41-year case covers only **two** of those parameters; the others require live NASA responses. |

## Start here — exact resources

- **English presentation:** https://projecturiel.earth/en/
- **English Explorer:** https://projecturiel.earth/en/telluris/explore/
- **Spanish presentation:** https://projecturiel.earth/
- **Original archived annual values:** [exp001-annual.json](../website/public/telluris/explore/data/exp001-annual.json)
- **Methods and independent checks:** [EXP-001 original data experiment](EXPERIMENT-001.md) and [EXP-005 statistical evidence](EXP-005-SIGNIFICANCE.md)
- **MODIS source-quality check:** [EXP-003B QA](EXP-003B-MOD13Q1-QA.md) and [EXP-003C spatial pre-screen](EXP-003C-SPATIAL-PRESCREEN.md)
- **Full judge evidence case:** [JUDGES-EVIDENCE-CASE-2026.md](JUDGES-EVIDENCE-CASE-2026.md)

**Availability note:** The public links above are targets documented in the source. A GitHub commit is not proof of the live BanaHosting deployment or official NASA submission. Before submitting, test links from an anonymous browser and verify the project is actually marked *submitted* on the official team page.

## Five evaluation lenses — factual evidence, no invented outcomes

1. **Impact:** Makes satellite/model-grid evidence accessible for education and environmental investigation. No measured social impact or field adoption is claimed.
2. **Creativity:** A bilingual inquiry journey, NASA GIBS globe, multiple parameters and comparative modes, plus explicit source-quality failure examples.
3. **Validation:** NASA source retrieval, independent SciPy checks for numerical aggregation/slope, reproducible source archive, and automated browser/code tests. Climate-product homogeneity, serial-dependence inference, and complete deployment QA remain open.
4. **Relevance:** Directly addresses selecting an Earth variable, identifying a location, extracting a temporal series, estimating trends, and cautiously assessing significance.
5. **Presentation:** The first minute follows **question → source → computation → failed QA → why it matters**. Prioritize a working demonstration rather than unverified features.

## Claims to avoid during judging

- “NASA verified these local climate trends” or “TELLURIS determines why the climate changed.”
- “Our 18 parameters have 41-year validated archives.”
- “We predict future droughts, earthquakes or rocket launch weather.”
- “Our AI model is live and scientifically validates results.”
- “The public deployment and official submission are completed” unless independently checked.

**Independent entry:** Project Uriel is not affiliated with or endorsed by NASA. All quoted values are exploratory, dataset-specific, and subject to the documented scientific limitations.
