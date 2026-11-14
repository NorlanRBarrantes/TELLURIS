# Contributing to TELLURIS

This project is developed by Project Uriel for NASA Space Apps Challenge 2026. Keep commits readable, scientifically accountable, and easy for reviewers to inspect.

## Language and documentation

- Use English for code-facing names, commit subjects, public documentation and external-facing scientific explanations.
- Keep the public README concise and accurate. Use docs/ for detailed methodology, sources, validation and architectural decisions.
- Internal brainstorming belongs in non-sensitive docs/_working/NOTES.md or in ignored local files.
- Never claim a feature is working or a scientific conclusion is true without reproducible evidence.

## Commit convention

Use Conventional Commits with an imperative English summary:

- feat: add NASA POWER temperature series explorer
- fix: correct missing-value handling for monthly observations
- docs: document data provenance and caveats
- test: verify Mann-Kendall with reference fixtures
- refactor: isolate the trend calculation module
- chore: configure static frontend build
- ci: add validation workflow

Rules:
1. Each commit should represent one coherent change.
2. Subjects should describe exactly what changed. Avoid vague phrases such as update, final, changes, test123, or working now.
3. Keep the subject succinct (target 72 characters or fewer); put motivation and limitations in the body if needed.
4. Never use a commit message that claims a deployment, successful test, or scientific result before it has been verified.
5. Keep experiments and generated data out of the commit unless they are required, small, documented and licensed.
6. Disclose AI assistance accurately in docs/AI-USE.md and the NASA submission.
7. Do not rewrite shared history merely for cosmetic corrections.

## Suggested working sequence

1. Read README.md, docs/CHALLENGE.md, docs/SCIENTIFIC-METHODOLOGY.md and docs/DECISIONS.md.
2. Record a new proposed decision when architectural or statistical choices change.
3. Implement one end-to-end, NASA-backed behavior.
4. Add tests and provenance, including negative cases.
5. Update the documentation and validation matrix.
6. Make a precise Conventional Commit.
7. Verify that no credentials or local-only notes are included.

## Scope and quality review

Prefer a small, fully evidenced scientific demonstration over many simulated or unfinished features. Distinguish point observations from regional summaries; preserve units, missing-data handling and statistical limitations.

Project documentation: docs/CHALLENGE.md · docs/VALIDATION.md · docs/SUBMISSION.md.
