# EXP-006 — NASA POWER vs GPM IMERG Final V07 precipitation

**2026-11-15 · Project Uriel / TELLURIS**  
**Implementation status:** offline NASA HDF5 original-granule extractor, bilingual Explorer import and reproducible comparison implemented and unit tested. **No GPM original 2001–2025 observations have yet been acquired for the site.** Do not claim independently validated rainfall trends or a live second-data feed until source data have been downloaded.

## Scientific purpose

The archived NASA POWER / MERRA-2 \`PRECTOTCORR\` values for Liberia and Limón in 1985–2025 produce extraordinarily large positive Sen slopes. Without checking product homogeneity, those slopes are **not defensible physical conclusions**. EXP-006 implements a test against a separate NASA precipitation product:

- **NASA GPM IMERG Final V07** (\`GPM_3IMERGM_07\`), 0.1° monthly satellite–gauge merged precipitation product, rates in **mm/hr**. Final is the research-grade delayed run; it is **not** completely gauge independent. [NASA collection](https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGM_07/summary).
- **NASA POWER \`PRECTOTCORR\`**, monthly bias-corrected precipitation rate in **mm/day**, which TELLURIS already converts to an annual accumulation (mm/year) using the exact number of days in every month.

**Compare 2001–2024 full years first:** the GPM retrospective period differs from POWER's 1985–2025; do not compare a 1985–2025 POWER slope against a 2001–2024 GPM slope. Restrict to actual **complete calendar years shared by the two inputs**. 2025 Final data may not be complete in real archives owing to production latency.

## Code added

1. [\`analysis/exp006_extract_imerg.py\`](../analysis/exp006_extract_imerg.py): converter from **genuine NASA original monthly HDF5 granules** to a schema-validated local JSON. It reads \`Grid/lat\`, \`Grid/lon\` and \`Grid/precipitation\`, validates the NASA monthly Final file naming and source units, finds the correct 0.1° source cell, rejects fill/nonfinite/mismatched observations, and stores **one SHA-256 per original file**.
2. [\`website/public/assets/gpm.js\`](../website/public/assets/gpm.js): parses the generated manifest and refuses wrong collection/run/version/unit/cell or duplicate months; aggregates mm/hr × 24 × exact calendar days to annual mm; requires all 12 calendar months of a year; compares only matching complete years with NASA POWER.
3. The **bilingual Explorer EXP-006 panel** becomes visible when \`PRECTOTCORR\` is selected and a NASA POWER source is loaded; the user can import an IMERG JSON from (1), review years of overlap, mean bias, RMSE, MAE, Pearson correlation and, when >=10 years, preliminary Theil–Sen slopes and the previous EXP-005 evidence tiers. Export an audit JSON with pairs and cautions.
4. [\`website/tests/gpm.test.js\`](../website/tests/gpm.test.js): synthetic-unit tests covering conversion, leap years, completeness, input rejection, year alignment, no invented result.
5. [\`tests/test_exp006_extract.py\`](../tests/test_exp006_extract.py): **synthetic HDF5 fixtures only** for original-file parser shape, unit, location, version and hashing; [QA workflow](../.github/workflows/exp006-raw-hdf5.yml).

**No automatic data fetching, no artificial GPM measurements and no authentication tokens in browser/source.** The browser must explicitly indicate that an imported manifest does not cryptographically prove it came from NASA just because its filenames and SHA-256 fields look valid. The raw file hash can be matched externally to the Earthdata download.

## Obtain REAL NASA IMERG inputs

1. Create a free **NASA Earthdata Login** if needed (https://urs.earthdata.nasa.gov/). Via [Earthdata Search](https://search.earthdata.nasa.gov/search?q=GPM_3IMERGM_07) find **GPM_3IMERGM_07, Final V07** and select the same interval and region as POWER. NASA moved **GES DISC direct download endpoints to Earthdata Cloud during 2026**; do not use retired GES DISC bulk wget paths. Use the current Earthdata Search/CMR granule URLs and authorize the downloads as needed.
2. Download original monthly files named like \`3B-MO.MS.MRG.3IMERG.YYYYMM01-...V07B.HDF5\` for **each month and site**. Do not substitute Early/Late or daily files, pre-aggregated anomaly charts, or an undocumented CSV.
3. On a computer with Python, run \`python -m pip install h5py numpy\`, then:
   \`\`\`bash
   python analysis/exp006_extract_imerg.py \
     --latitude 10.63 --longitude -85.44 \
     --out imerg-liberia-originals.json \
     /path/to/monthly/originals/3B-MO.MS.MRG.3IMERG.*.HDF5
   \`\`\`
   Repeat \`--latitude 9.99 --longitude -83.03\` to create a separate source-cell file for Limón. Do **not** merge the locations.
4. In [TELLURIS Explorer](https://projecturiel.earth/telluris/explore/), choose **annual precipitation / PRECTOTCORR**, the corresponding coordinates and 2001–2024, load either archived POWER data or request fresh NASA POWER, then import the normalized IMERG JSON into **EXP-006**. Export the comparison evidence for judges.

A run with only a few files **will correctly show no annual observations or no overlapping complete years**. Complete years require precisely 12 monthly files. Comparison does not use synthetic imputations. NASA source coordinates may represent **different spatial footprints**, even at the same requested lat/lon.

## Methodological cautions for judges

- IMERG is a **multisatellite plus gauge-calibrated** rainfall product; not an entirely independent set of ground observations.
- Correlation is not causal evidence or sensor agreement at every location; two grids differ in spatial support.
- Unusual differences may arise from unit mistakes, source bias, or product discontinuity. An unusual match can arise from shared inputs/corrections.
- Both products are changing algorithms over long records; each version and source must be audited for homogeneity.
- Source file identity and SHA-256 metadata from a locally imported manifest can be spoofed. Preserve originals and independent Earthdata verification.
- Only complete overlapping years are used. A Sen slope, raw MK p or block sensitivity remains **exploratory** under EXP-005, never labeled independently validated.
- A research demonstration can show this independent-source comparison is **implemented but without GPM source data loaded**. Do not present fabricated convergence/divergence.

## Source documentation

- NASA [IMERG Final GES DISC collection](https://gpm.nasa.gov/node/3328) — 1-month product and mm/hr unit.
- NASA [GPM data directory](https://gpm.nasa.gov/data/directory) — Final run, version V07, approximate 0.1° source cells.
- NASA [GES DISC migration to Earthdata Cloud](https://github.com/nasa/gesdisc-tutorials/blob/main/user-guidance/GES_DISC_Migration_to_Earthdata_Website_and_Earthdata_Cloud.md) — 2026 retrieval procedure.
- NASA [IMERG V07 technical documentation](https://gpm.nasa.gov/sites/default/files/2023-07/IMERG_TechnicalDocumentation_final_230713.pdf) — native monthly file names and 3IMERGM.
