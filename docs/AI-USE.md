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
