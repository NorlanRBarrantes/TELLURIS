# Project guidance for coding assistants

Read this file and README.md before changing TELLURIS. This repository will be used for a NASA Space Apps Challenge 2026 submission.

## Non-negotiable practices

1. Follow the chosen challenge: Be An Earth System Trend Detective!
2. Never invent NASA data, historical observations, scientific findings, or successful tests.
3. Do not conflate a NASA POWER point estimate with a full-region climate average.
4. Keep provenance (provider, URL, variable, units, location, period, processing and versions).
5. Implement statistical algorithms with documented assumptions and independent validation tests.
6. Label proposed functionality and unexecuted steps as such.
7. Do not introduce server dependencies incompatible with an unverified BanaHosting shared environment.
8. Do not commit tokens, passwords, .env secrets, cPanel access details, access logs or sensitive working documents.
9. Keep reviewer-facing artifacts in English; use accurate license and AI-disclosure records.
10. Use Conventional Commits in English with truthful, scoped subjects.
11. All third-party datasets, images, fonts, icons and libraries require attribution/license review.
12. Do not use NASA branding in a way that implies endorsement.
13. Before final delivery, remove docs/_working/NOTES.md from the current tree, but remember historical commits remain accessible.

## Sources of truth

- docs/DECISIONS.md: approved and proposed decisions.
- docs/CHALLENGE.md: explicit challenge requirements.
- docs/DATA-SOURCES.md: data/attribution information.
- docs/SCIENTIFIC-METHODOLOGY.md: statistical protocol.
- docs/VALIDATION.md: evidence that a claim actually works.
- docs/DEPLOYMENT.md: hosting constraints.
- docs/SUBMISSION.md: final review checklist.

A source file or documentation claim must be updated with the same change that alters its behavior.
