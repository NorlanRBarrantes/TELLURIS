# External reference study — Afterglow (identity unresolved) and accessible-science lessons

**Review date:** 2026-11-15 (Costa Rica)
**Requested exact target:** https://afterglow.work/index.html
**Evidence status:** **PRIMARY TARGET NOT INSPECTED.** The direct URL, www variant and archived-route attempt could not be retrieved by the available browser tools; searches for the literal domain did not produce an independently attributable description or screenshots. No page, feature, stack, author, design detail, animation or affiliation is asserted for **afterglow.work**. This is an explicitly bounded preliminary study, not a finished audit of that target.

**Identity warning:** Several unrelated products are named *Afterglow* (astronomy image analysis, a game, software design systems, open-source visualization, etc.). In particular, **Afterglow Access** at IDATA/Skynet is an **independently verifiable, separate reference** and must NOT be identified as `afterglow.work` without direct evidence. The analysis below derives *cross-domain* design principles from that distinct product and proposes original TELLURIS adaptations, not copies.

## A. What can actually be substantiated

**Verified independent reference: Afterglow Access (AgA).** IDATA describes AgA as browser-based astronomy image/data analysis software designed for screen readers, with data sonification so blind and low-vision users can inspect astronomical observations. American Astronomical Society coverage describes iterative universal/user-centered design with users, educators and researchers, plus no-install access. A researcher with the Skynet project describes the earlier Afterglow's source-adjacent data exploration, alignment/blink, annotated measurements, photometry, light curves and batch analyses. These are attributed properties of **AgA/its predecessor**, not the uninspected requested URL.

Sources with explicit identity:
- IDATA resources (AgA program owner): https://idataproject.org/resources/
- American Astronomical Society (2021, accessibility, user-centered process): https://aas.org/posts/news/2021/04/universe-just-became-more-accessible-free-software-exploring-universe-through
- Dan Reichart, Skynet/Afterglow research account (data tools, photometry, comparisons): https://www.danreichart.com/afterglow
- International Astronomical Union accessibility poster (user-centered process): https://iau-oao.nao.ac.jp/iaus358/poster-session-1-1-2/
- TERC/IDATA context: https://www.terc.edu/seec/terc-projects/innovators-developing-accessible-tools-for-astronomy-idata/

**Not verified:** requested site structure, product pitch, screenshots, technical stack, authorship, licensing, award status, UI performance, code reuse rights or any similarity with AgA. Do not place an image labeled `afterglow.work screenshot` in the repository. Avoid reusing photographs, layouts or source code without licenses.

## B. Positive practices transferable to TELLURIS (adaptations, not borrowed features)

| Evidence-based practice or general insight | Why it helps scientific tools | TELLURIS original adaptation | Gate |
| --- | --- | --- | --- |
| **One browser-based investigation workspace** (AgA reference) | Reduces software installation friction and lets users access observations quickly | Keep the no-install Explorer, compatible with static shared hosting and predictable NASA API failure states | Public ES/EN browser smoke; no login barrier to core demo |
| **Source data + visually inspectable instruments** (Afterglow astronomy history) | Scientists need to inspect what produced a result instead of trusting a decorative visualization | Place source layer/date, coordinates, units, QA flags and a link to original NASA query beside trends/globe layers | Report-to-source reproducibility, raw-vs-rendered distinction |
| **Guided, task-based exploration** (AgA educational context; inference for Earth science) | Novices learn the question → source → transform → evidence → limitation sequence | Introduce short, optional investigation recipes such as compare T2M across two locations or examine USGS events without implying climate causation | Every recipe executable with real source and an explainable no-result case |
| **Data sonification as an alternative, not a replacement** (AgA) | A chart-only interface excludes some users; audio can expose shape/pattern | Future **opt-in** sonification of a normalized scalar NASA series, with accessible legend, playback controls and a simultaneous numeric table | Verify against values, screen-reader usability, perceptual mapping, muted/reduced motion and audio off by default |
| **Keyboard and screen-reader design** (AgA/IDATA) | Interactive canvases and WebGL maps can otherwise trap users | Accessible list/table alternative for 3D globe, event positions and chart descriptions; focus return, skip links, labeled filters and live error status | WCAG 2.2 AA-oriented manual and automated checks; never claim certification without audit |
| **Iterative user-centered testing** (IDATA) | Engineering tests cannot demonstrate that novices understand scientific caveats | Test 3 roles: judge unfamiliar with data, STEM student, technical researcher. Ask each to reproduce a result and explain what it does *not* prove | Task completion, comprehension, errors and time-to-evidence observed; adapt language based on findings |
| **Compare original observations** (Afterglow image alignment / blink; analogy) | A/b comparisons expose discrepancies rather than forcing one narrative | Optional side-by-side synchronized 3D layer and charts for one variable across matched dates/locations; separate products explicitly | Source-specific georegistration, matched dates/footprints and unit equivalence |
| **Measurement and uncertainty before effects** (transfer of research ethos) | Visually impressive charts may overstate observational or causal certainty | Keep explorable equations, Theil–Sen slope/decade, p-value assumptions, QA and confidence caveats next to conclusions | Independent reference tests, explicit inconclusive states |
| **Layered complexity for beginners and experts** (design recommendation) | A scientific system needs an accessible entry point without hiding method | Present a concise default card and an expandable methods/source panel; preserve all evidence exports for reviewers | No lost details in collapsed state; mobile/keyboard tests |
| **High-quality education and reference material** (AgA published resource hub) | A demo alone is not sufficient for replicable scientific investigations | 3 short, bilingual guided examples with source URLs, known negative findings and methodological glossary | Reproducible outputs and no invented trend findings |

### Concrete interaction concept for vNext

**"Explore an observation" (proposed; not coded):**
1. Choose a scientific question and applicable physical variable; explain why a source can answer it.
2. Choose the valid geography, source product, time period and its resolution.
3. Inspect the *actual* series and source QA/coverage; show source status and missingness.
4. Compare compatible locations/periods; never force categorical/event data into continuous linear-trend math.
5. View slope/uncertainty, source assumptions and at least one alternate or inconclusive interpretation.
6. Export a bilingual reproducibility card (source, version, date, coordinates, years, method, original request and disclaimers).
7. Offer **optional** table/accessible-description/sonification alternatives, with no accessibility feature required to experience the basic product.

**Do not build this anew for the 2026 submission**: much of the research functionality already exists in GitHub. Treat the proposed flow as a post-deadline UX consolidation specification.

## C. Scientific translation risks: astronomy ≠ Earth-system trends

- Astronomical image enhancement, contrast stretching, or blinking cannot be presented as measured Earth temperature, precipitation or burned area. Numeric values must derive from the original physical products, not rendered RGB.
- Sonified sound is a **secondary representation**, not direct scientific evidence or a replacement for exact source values. Frequencies, scaling and missing-data cues require a published mapping and user testing.
- A single plotted difference does not prove a statistically significant long-term climate trend or a causal mechanism.
- Image/point geographic co-registration, time windows, NASA POWER cell support, MODIS pixel QA, USGS catalog completeness and other mission-specific limitations remain essential.
- Accessibility goals should be evaluated with affected users, not inferred from the presence of an ARIA attribute or keyboard shortcut.

## D. Afterglow.work-specific deep-review checklist (deferred, not observed)

When the **exact** requested URL can be inspected, record with date/time and evidence for each item:

| Audit dimension | Evidence to capture | Relevance to TELLURIS |
| --- | --- | --- |
| Product/ownership | Headline, about, authors, purpose, public references | Confirm identity; avoid mixing namesakes |
| Judge/visitor narrative | First screen, stated problem, immediate CTA, guided tour, progressive disclosure | Keep EXP-012 product-first, skip-to-last behavior |
| Visual composition | Genuine screenshots of desktop/mobile, typography, color, layout, state transitions | Assess readability, not imitation |
| Interaction architecture | Input → loading → evidence → output, user state, empty/error recovery | Reduce time to first actual NASA result |
| Visualization credibility | Legends, units, scale, data vs illustration, source citation | Keep GIBS imagery distinct from measured trends |
| Accessibility | Keyboard, zoom, focus, reduced motion, screen readers, chart alternatives | Find precise TELLURIS deficits |
| Technical/performance | Network waterfall, dependency weight, lazy-load, offline states; only if observed | Shared hosting/API reliability |
| Security/privacy | Third-party scripts, public API tokens, user inputs, provenance | No static secrets or unsafe fetching |
| Attribution/open license | Terms, repo, embedded media/source rights | No unlicensed copies |
| Evidence of quality | Tests, research process, independent references, documented limitations | Scientific trust instead of unsupported claims |

Only after directly observing the target should the table be completed with findings, scores, screenshots, and recommendations attributed specifically to `afterglow.work`.

## E. Priority decision

- **2026 / now:** no redesign and no speculative reference-based features. Finish the NASA submission and maintain the EXP-012 visual identity and functional scientific core.
- **Post-submission P1:** evidence-first onboarding, accessible alternatives to globe/charts, reproducible one-click examples, clearer source/data-vs-illustration labels.
- **Post-submission P2:** task-based geospatial comparisons and optional scientifically sound sonification prototype (user tested).
- **Post-submission P3:** inspect `afterglow.work` directly when reachable, independently audit its actual UX/technology and only then consider additional changes.

### Decision integrity

This document credits AgA/IDATA for verifiable practices and records the unavailable target honestly. It makes **zero claims** that `afterglow.work` is Afterglow Access, has NASA affiliation, won awards, or supports any specific functionality. The analyses and product proposals are original to Project Uriel and are not a request to copy third-party media or code.
