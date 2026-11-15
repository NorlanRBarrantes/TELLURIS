# AI assistance and responsible disclosure

## Policy

AI tools may assist with research organization, writing, code generation, test preparation, UI design and plain-language explanations. This project must accurately disclose such assistance in its NASA submission, including the tools actually used.

AI-generated text and code require human review. AI is not accepted as a scientific data source or independent proof of the accuracy of computed findings.

## Recorded assistance at project initialization

- **OpenAI ChatGPT:** Assisted with concept exploration, project naming discussion, technical planning, public documentation drafting, challenge/source research, and initial GitHub repository changes on November 14, 2026.
- **Scientific data results:** None validated at the time of the initial documentation commits.
- **Other AI tools at initialization:** None recorded at the first documentation commit; additional use is documented below.

## External research review — November 14, 2026

- A team-supplied research brief proposed a Pacific–Caribbean climate contrast, more advanced Mann-Kendall methods, and an ESP32 display demonstration.
- The method and product concepts were **reviewed and selectively incorporated** with ChatGPT assistance against NASA POWER documentation, the challenge statement, the pyMannKendall project, and published Central American climate literature.
- **Authorship of the supplied brief or use of a specific AI tool for that brief was not independently established.** Update this log if the team confirms the tool or author; do not incorrectly claim Gemini authored this document merely because other Gemini material may later be shared.
- No time-series results, hardware integration, or statistical execution has been verified from that brief.


## Second external AI research review — November 14, 2026

- **Google Gemini:** Team supplied an AI-assisted research/audit report assessing sources, statistical methodology, Costa Rica case studies, hosting, competition differentiation and optional ESP32 hardware. It was used as a planning input, **not** as data or validated computations.
- **OpenAI ChatGPT:** Critically reviewed the supplied report against the official NASA challenge, NASA POWER/GPM documentation and statistical-method references; drafted scoped updates to repository documentation and proposed quality checks.
- **Excluded as unverified:** Numerical trend claims, p-values, climate correlations, global-case outcomes, API timing/browser benchmarks, assumed shared-hosting support, event judges and comparative claims about other hackathon submissions.
- **Scientific execution:** No real-data computation or production app verification is claimed by this research review.


## Gemini EXP-001 code review and rewrite — November 14, 2026

- **Google Gemini:** Produced the submitted research report and preliminary Python implementation for the proposed NASA POWER Liberia/Limón experiment; explicitly reported that no live NASA dataset was accessed or numerical results computed.
- **OpenAI ChatGPT:** Audited the report, checked NASA API/GPM documentation, rewrote the experimental Python script with stronger metadata/quality checks and guarded statistical interpretation, prepared 11 synthetic unit tests, and updated repository documentation.
- **Executed checks:** 11 local synthetic tests passed. An attempted live NASA API request failed DNS resolution from the execution environment. There are no verified real climatological results or production deployments from EXP-001.
- **Caveat:** Do not represent Python/SciPy-generated p-values from unexamined serially dependent source observations as confirmed significance. Confirm accuracy independently before publication.

## Third Gemini adversarial code-review report — November 14, 2026

- **Google Gemini:** Supplied a third review prompt response suggesting tie/continuity, Sen calendar-gap, paired-difference and autocorrelation tests. Gemini stated it had not received the actual repository files, and its output was treated as hypotheses to inspect rather than findings.
- **OpenAI ChatGPT:** Compared the suggestions against repository source and SciPy/pyMannKendall documentation, independently evaluated the original numerical examples, repaired two unsuitable test assertions, implemented six targeted synthetic tests and fixed a real calendar-gap issue in lag-1 diagnostic reporting.
- **Verification:** 17/17 tests passed in [GitHub Actions run #43649103042](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43649103042). Follow-up CI with updated Node 24 actions also succeeded in [run #43649183358](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43649183358).
- **Limitation:** All tests used synthetic values. No empirical NASA trends were obtained or inferred from this exercise.


## Fourth Gemini code-audit report — November 14, 2026

- **Google Gemini:** Produced a second-generation adversarial report describing six hypothetical faults in EXP-001, again noting that the current repository source files were not accessible in its context.
- **OpenAI ChatGPT:** Inspected the actual GitHub EXP-001 implementation and scientific-library source; rejected five inapplicable/already-solved claims, clarified the correct interpretation of the paired difference, and expanded the synthetic regression suite.
- **Reproducibility:** An initial synthetic test assumption about NaN-padded pyMannKendall Sen slopes failed in CI and was corrected. The final [21/21 CI execution](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43650944212) succeeded.
- **Integrity:** No actual NASA POWER data, climate trends, autocorrelation-corrected p-values or causal attribution were produced in this review.


## Scientific safeguards

- NASA/source data values must come from attributable datasets.
- Statistical results must come from deterministic software with reproducible inputs.
- AI summaries should be generated only from verified result structures and should include uncertainty/limitations.
- Never invent citations, measurements, satellite captures, dates, statistical significance, or visual comparisons.
- Label illustrations and synthetic test data so they cannot be mistaken for observations.

## Visual / brand safeguards

Do not imply NASA endorsement or generate/reuse NASA brand assets without confirming the applicable branding policies and permissions. Attribute third-party illustrations, images, map layers, icon libraries, and fonts.

References:
- NASA legal terms: https://www.spaceappschallenge.org/legal/
- NASA Space Apps branding: https://www.spaceappschallenge.org/brand/

## Project Uriel public-site drafting — November 14, 2026

- **OpenAI ChatGPT:** Reviewed existing TELLURIS README, challenge interpretation, product scope, methodology, evidence register, experiment report, deployment records and architecture decisions to prepare a static, bilingual Project Uriel site and research-stage TELLURIS introduction for `projecturiel.earth`.
- **Assets:** Drafted HTML, CSS, small progressive-enhancement JavaScript research-question generator, original SVG/Python-created OpenGraph illustrations and metadata (canonical, hreflang, sitemap, robots, JSON-LD).
- **Disclosure:** The question generator makes no NASA API calls and computes no scientific results. Existing 11 synthetic QA tests are described as synthetic and are not evidence of climate change findings.
- **Verification boundary:** Local static render and interaction checks do not establish that the site was deployed on BanaHosting, indexed by Google or scientifically validated.
- **Human review:** Content, brand, accessibility, DNS/hosting settings and NASA submission references require team review before publication.


## Web MVP and real NASA acquisition — November 14/15, 2026

- **NASA (not AI):** NASA POWER API v2.10.0 returned authentic MERRA2 monthly T2M/PRECTOTCORR values for Liberia and Limón, 1985–2025, during Actions run 43656774519. Original response SHA-256 digests and provenance are recorded in EXP-001.
- **OpenAI ChatGPT:** Created the source-acquisition workflow, inspected its NASA artifacts, independently recalculated four slopes using SciPy, implemented static browser Explorer 0.1 with scientific provenance and exploratory caveats, wrote JavaScript tests and deployment instructions.
- **Google Gemini:** Earlier concept/review contributions remain documented above; no Gemini climate numbers have been substituted for real NASA data.
- **Boundary:** Neither API retrieval nor algorithm parity validates underlying time-series homogeneity, serial-independence assumptions, statistical significance claims or public deployment.


## Spanish-first site and Gemini global benchmark critique — November 14, 2026

- **Google Gemini:** Suggested global pairs, Pacific-side control, June–August rainfall analysis, mirrored-slope invariants and random permutations as possible validation. The suggestions are hypotheses, not proof of pre-known NASA POWER trend signs or valid significance.
- **OpenAI ChatGPT:** Evaluated claimed expected signs and statistical shortcuts, researched the NASA challenge, CLLJ/midsummer-drought literature and IMERG official source, developed the bilingual public pages and localized browser messages, automated six-route/SEO/asset QA, and registered a falsifiable EXP-002 research plan.
- **Rejected without evidence:** Guaranteed p-values/signs for Frankfurt–Delhi, Chile, Sahel–Congo or Liberia–Nicoya; causal attribution to a single driver; claims that naïve year shuffling controls false positives with autocorrelation, or that p>0.05 establishes equivalence.
- **Evidence limit:** QA confirms implementation in GitHub; public Spanish pages still require deployment verification, and EXP-002 field analyses are not yet executed.

## Broader scope and hydrology variable review — November 14, 2026

- **OpenAI ChatGPT:** Compared the official NASA 2026 challenge text supplied by the team against the current repository, verified NASA source catalogs for POWER/GLDAS/SWOT/MODIS/SMAP/GRACE/PO.DAAC and CUAHSI, and formally drafted the wider mission, NASA requirements-to-implementation matrix and cross-domain variable catalog.
- **Google Gemini:** An additional team-supplied EXP-002 research brief proposed hydrological and global comparisons and a Python script. It was read as a set of research leads only; **none of its unsupported trend-significance claims, causal narratives or untested code** were promoted to validated science. In particular, its arbitrary `value > -900` filtering and automatic Hamed–Rao choice were not adopted.
- **Verification boundary:** New variable catalog entries are documented NASA product/source candidates, **not evidence of actual new API integrations, river-flow observations or numerical climate findings**.

## Team/sibling contributed scientific inventory — 2026-11-15

The user submitted a markdown inventory requested by their sister in a separate chat. Project Uriel preserved the original research proposal as `docs/TEAM-CATALOG-2026-11-15.md`. OpenAI ChatGPT reviewed and normalized the 49 candidates and 10 derived indicators, compared them with the approved mission and official NASA descriptions (e.g., FIRMS, Black Marble, LHASA), and recorded scientific corrections and integration state. The original chat/model and source-checking process of the sibling's draft are **not independently known**. None of its unverified candidate data sources or modeled phenomena should be represented as connected NASA data or an empirical scientific result.

## Gemini source comparison for EXP-003 — November 15, 2026

A team-forwarded Gemini report compared MODIS vegetation indices, FIRMS fire detections/FRP and VIIRS Black Marble nightlights, supplying official NASA documentation links and an example ORNL request. OpenAI ChatGPT checked these against NASA official sources, executed an ORNL NASA real-response probe via GitHub Actions, discovered/corrected the object-wrapped dates parser, and implemented experimental Python retrieval + QA tests. Incorrect claims about FIRMS area API 10-day range, invalid treatment of raw -2000 and causal interpretation of cross-variable correlations were rejected. Neither model may claim a significant trend or guarantee a win without source data and independent statistical validation. See [EXP-003 review](EXP-003-VEGETATION.md).


## Evidence assistant — November 15, 2026

The active browser component is deterministic and rule-based, not a generative model or a live AI-provider connection. It rephrases calculations already supplied by the evidence engine and keeps provisional significance qualifications. A future LLM integration is documented in FEATURES-3D-EVIDENCE-AI.md but has NOT been built, secured, or validated.

## Gemini MODIS QA and Terra drift audit — November 15, 2026

The team forwarded an additional Gemini report asserting orbit-drift effects, detailed MOD13Q1 QA bit definitions, revised annual sampling thresholds and anomaly-by-16-day-cycle methods; it included example Python with tests. OpenAI ChatGPT assessed the assertions against official NASA MODIS sources and original ORNL API data, adopted testable QA fields and coverage-sensitivity comparisons, and rejected mandatory sign-of-bias forecasts, automatic Hamed–Rao and SZA "corrections", and unsupported claims that a 3-year baseline proves any long-term trend. A separate pure-Python [EXP-003B audit](EXP-003B-MOD13Q1-QA.md) reprocesses authenticated archival NASA JSON without overwriting the originals; 12 automated unit tests and one original-data run passed. Team authorship/AI origins remain disclosed; neither system produced validated NDVI/EVI climate trends.

## Team-forwarded Gemini Caribbean site proposal — November 15, 2026

The user's team forwarded a Gemini report with unverified environmental/geographic names, precise coordinates, claimed MERRA-2 model cell identity and a sample ORNL API script. Original report preserved in `docs/_working/GEMINI-EXP-003C-ORIGINAL.txt`. ChatGPT compared the report with NASA ORNL, MOD13 QA, MCD12 landcover and NASA POWER documentation; detected the proposed Hitoy coordinate outside Gemini's own MERRA cell bounds, clarified 1 km API radius means a 9×9 source response rather than a 3×3 response, and refused to label candidate coordinates verified forest or replicate POWER climatology without an actual request. The independent [EXP-003C protocol](EXP-003C-SPATIAL-PRESCREEN.md) and synthetic spatial indexing/QA tests were added, with live NASA acquisition tracked separately. Neither AI model computed an NDVI/EVI temporal trend from these new sites.
