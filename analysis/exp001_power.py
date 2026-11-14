#!/usr/bin/env python3
"""TELLURIS Experiment 001: traceable POWER monthly point trend analysis.

Run against the NASA POWER API (requires network):
    python analysis/exp001_power.py --run
Run from separately acquired NASA response files (offline):
    python analysis/exp001_power.py --liberia-file PATH --limon-file PATH

All results are descriptive/exploratory until independence assumptions and
source metadata have been checked. Never interpret this as causal attribution.
"""

from __future__ import annotations

import argparse
import calendar
from datetime import datetime, timezone
import json
import math
from pathlib import Path
from typing import Any
from urllib.parse import urlencode

import numpy as np
import requests
from scipy.stats import theilslopes

API_BASE = "https://power.larc.nasa.gov/api/temporal/monthly/point"
LOCATIONS = {
    "Liberia": {"lat": 10.63, "lon": -85.44},
    "Limon": {"lat": 9.99, "lon": -83.03},
}
VARIABLES = ("T2M", "PRECTOTCORR")
MIN_YEARS = 10  # Screening threshold for this experiment; not a NASA rule.


def build_url(lat: float, lon: float, start: int, end: int, community: str) -> str:
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise ValueError("Coordinates outside latitude/longitude bounds")
    if start > end or not (1981 <= start <= 2100 and 1981 <= end <= 2100):
        raise ValueError("Invalid year range")
    if community not in {"AG", "RE", "SB"}:
        raise ValueError("Unsupported NASA POWER community")
    return API_BASE + "?" + urlencode({
        "parameters": ",".join(VARIABLES), "community": community,
        "longitude": lon, "latitude": lat,
        "start": start, "end": end, "format": "JSON",
    })


def download_json(url: str) -> dict[str, Any]:
    response = requests.get(url, timeout=(10, 45), headers={"User-Agent": "TELLURIS-exp001/0.1 (research)"})
    response.raise_for_status()
    payload = response.json()
    if not isinstance(payload, dict):
        raise ValueError("NASA API did not return a JSON object")
    return payload


def _valid_number(raw: Any, fill: float) -> float | None:
    if raw is None or isinstance(raw, bool):
        return None
    try:
        value = float(raw)
    except (ValueError, TypeError, OverflowError):
        return None
    if not math.isfinite(value) or value == fill:
        return None
    return value


def parse_annual(payload: dict[str, Any], start: int, end: int) -> dict[str, Any]:
    """Use only months 01..12, real NASA units and 12/12 complete years.

    A year may be complete for one variable and incomplete for another.
    Annual values are aggregated separately before any paired comparison.
    """
    try:
        parameter = payload["properties"]["parameter"]
        units = {v: payload["parameters"][v]["units"] for v in VARIABLES}
        fill = float(payload["header"]["fill_value"])
        t2m = parameter["T2M"]
        precip = parameter["PRECTOTCORR"]
    except (KeyError, TypeError, ValueError) as exc:
        raise ValueError("Missing/malformed NASA POWER parameter metadata") from exc
    if not isinstance(t2m, dict) or not isinstance(precip, dict):
        raise ValueError("NASA parameter time series must be objects")
    if units["T2M"] not in {"C", "°C", "degC"}:
        raise ValueError("Unexpected T2M unit: " + repr(units["T2M"]))
    if units["PRECTOTCORR"] not in {"mm/day", "mm/d"}:
        raise ValueError("Unexpected PRECTOTCORR unit: " + repr(units["PRECTOTCORR"]))
    if not math.isfinite(fill):
        raise ValueError("Non-finite NASA fill value")

    annual: dict[str, dict[int, float]] = {v: {} for v in VARIABLES}
    incomplete: dict[str, list[int]] = {v: [] for v in VARIABLES}
    missing: dict[str, list[str]] = {v: [] for v in VARIABLES}
    for year in range(start, end + 1):
        rows = {v: [] for v in VARIABLES}
        for month in range(1, 13):  # Explicitly excludes NASA's possible YYYY13 annual entry.
            key = f"{year}{month:02d}"
            days = calendar.monthrange(year, month)[1]
            for var, data in (("T2M", t2m), ("PRECTOTCORR", precip)):
                number = _valid_number(data.get(key), fill)
                if var == "PRECTOTCORR" and number is not None and number < 0:
                    number = None  # Negative precipitation is invalid, unlike temperature.
                if number is None:
                    missing[var].append(key)
                rows[var].append((number, days))
        for var in VARIABLES:
            if all(value is not None for value, _ in rows[var]):
                weighted_sum = sum(float(value) * days for value, days in rows[var])
                annual[var][year] = (weighted_sum / sum(days for _, days in rows[var])
                                     if var == "T2M" else weighted_sum)
            else:
                incomplete[var].append(year)
    return {
        "annual": annual,
        "qa": {
            "provider": "NASA POWER", "parameters": list(VARIABLES),
            "units_source": units, "units_annual": {"T2M": "C", "PRECTOTCORR": "mm/year"},
            "fill_value": fill, "source_header": payload.get("header", {}),
            "coordinates_returned": payload.get("geometry", {}).get("coordinates"),
            "period_requested": [start, end], "missing_months": missing,
            "incomplete_years": incomplete,
            "n_complete_years": {v: len(annual[v]) for v in VARIABLES},
            "annual_summary_keys_ignored": {
                v: sum(f"{yr}13" in parameter[v] for yr in range(start, end + 1)) for v in VARIABLES
            },
        },
    }


def mann_kendall_independent(values: list[float]) -> dict[str, float | bool | int]:
    """Original MK S with tie-corrected variance + continuity correction.

    The p-value assumes independent samples; it is NOT valid as the final
    significance claim when serial dependence has not been addressed.
    """
    n = len(values)
    if n < 2:
        raise ValueError("Need at least two observations")
    arr = np.asarray(values, dtype=float)
    if not np.isfinite(arr).all():
        raise ValueError("Non-finite trend observations")
    s = sum(int(np.sign(arr[j] - arr[i])) for i in range(n - 1) for j in range(i + 1, n))
    _, counts = np.unique(arr, return_counts=True)
    tie_term = sum(int(c * (c - 1) * (2 * c + 5)) for c in counts if c > 1)
    var_s = (n * (n - 1) * (2 * n + 5) - tie_term) / 18.0
    z = (s - 1) / math.sqrt(var_s) if s > 0 and var_s > 0 else (
        (s + 1) / math.sqrt(var_s) if s < 0 and var_s > 0 else 0.0)
    p_value = math.erfc(abs(z) / math.sqrt(2))
    return {"s": s, "variance_s": var_s, "z": z, "p_value": p_value,
            "kendall_tau": s / (n * (n - 1) / 2),
            "significant_at_0_05_if_independent": p_value < 0.05}


def analyze(annual: dict[int, float]) -> dict[str, Any]:
    years = sorted(annual)
    if len(years) < MIN_YEARS:
        return {"status": "insufficient_years", "n": len(years), "minimum": MIN_YEARS}
    y = np.array([annual[year] for year in years], dtype=float)
    x = np.array(years, dtype=float)
    sen = theilslopes(y, x, alpha=0.95)
    mk = mann_kendall_independent(y.tolist())
    residuals = y - sen.slope * (x - x[0])
    if np.std(residuals[:-1]) > 0 and np.std(residuals[1:]) > 0:
        lag1 = float(np.corrcoef(residuals[:-1], residuals[1:])[0, 1])
    else:
        lag1 = None
    return {
        "status": "exploratory_independence_not_established", "n": len(years),
        "years": years, "period": [years[0], years[-1]],
        "trend": {"method": "Theil-Sen (SciPy)", "slope_per_year": float(sen.slope),
                  "slope_per_decade": float(sen.slope * 10),
                  "ci_95_per_decade_assuming_independence": [float((sen.low_slope if hasattr(sen, "low_slope") else sen.lowslope) * 10),
                                                             float((sen.high_slope if hasattr(sen, "high_slope") else sen.highslope) * 10)]},
        "mann_kendall_original": mk,
        "lag1_on_detrended_residuals_diagnostic_only": lag1,
        "warnings": [
            "Original Mann-Kendall significance and Sen CI assume appropriate temporal independence.",
            "A single lag-1 estimate does not validate independence or select an autocorrelation correction.",
            "A trend test does not establish physical causality.",
        ],
    }


def compute_report(input_data: dict[str, dict[str, Any]], start: int, end: int) -> dict[str, Any]:
    parsed = {name: parse_annual(input_data[name]["payload"], start, end) for name in LOCATIONS}
    outcome = {
        "experiment_id": "EXP-001", "status": "exploratory_not_final_scientific_validation",
        "methods": {"annual_aggregation": "12/12 months; precipitation mm/day × days/month; temperature day-weighted annual mean",
                    "trend": "Theil-Sen with independent-sample CI; original tie-corrected Mann-Kendall",
                    "serial_dependence": "lag-1 diagnostic only; no automatic correction or significance claim"},
        "locations": {}, "paired_difference": {},
    }
    for name in LOCATIONS:
        outcome["locations"][name] = {
            "requested_coords": LOCATIONS[name],
            "retrieval": {k: v for k, v in input_data[name].items() if k != "payload"},
            "qa": parsed[name]["qa"],
            "annual": {var: [{"year": year, "value": value} for year, value in sorted(parsed[name]["annual"][var].items())]
                       for var in VARIABLES},
            "analysis": {var: analyze(parsed[name]["annual"][var]) for var in VARIABLES},
        }
    for var in VARIABLES:
        one, two = (parsed[place]["annual"][var] for place in LOCATIONS)
        common = sorted(set(one).intersection(two))
        diff = {year: one[year] - two[year] for year in common}
        outcome["paired_difference"][var] = {
            "description": "Trend in Liberia minus Limon annual difference; not a causal explanation or proof of identical Sen slopes",
            "common_years": common, "units": "C" if var == "T2M" else "mm/year",
            "analysis": analyze(diff),
        }
    return outcome


def run_cli() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--run", action="store_true", help="Get NASA POWER responses over HTTPS")
    mode.add_argument("--liberia-file", type=Path, help="Offline NASA JSON for Liberia (also needs --limon-file)")
    parser.add_argument("--limon-file", type=Path, help="Offline NASA JSON for Limon")
    parser.add_argument("--start", type=int, default=1985)
    parser.add_argument("--end", type=int, default=2025)
    parser.add_argument("--community", default="RE", choices=["AG", "RE", "SB"])
    parser.add_argument("--out", type=Path, default=Path("data/raw/exp001"))
    args = parser.parse_args()
    if not args.run and args.limon_file is None:
        parser.error("Offline mode requires --liberia-file and --limon-file")
    args.out.mkdir(parents=True, exist_ok=True)
    dataset = {}
    for name, loc in LOCATIONS.items():
        url = build_url(loc["lat"], loc["lon"], args.start, args.end, args.community)
        if args.run:
            payload = download_json(url)
            raw_path = args.out / f"nasa_power_{name.lower()}_raw.json"
            raw_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
            provenance = {"url": url, "retrieved_utc": datetime.now(timezone.utc).isoformat(), "raw_file": str(raw_path)}
        else:
            raw_path = args.liberia_file if name == "Liberia" else args.limon_file
            payload = json.loads(raw_path.read_text(encoding="utf-8"))
            provenance = {"source_file": str(raw_path), "url_expected": url,
                          "retrieved_utc": None, "note": "Original download timestamp not provided in offline mode"}
        dataset[name] = {"payload": payload, **provenance}
    results = compute_report(dataset, args.start, args.end)
    out_path = args.out / "exp001_results.json"
    out_path.write_text(json.dumps(results, ensure_ascii=False, indent=2, allow_nan=False), encoding="utf-8")
    print(f"Created {out_path}. Exploratory statistics only; see assumptions in JSON.")
    for name in LOCATIONS:
        print(name, {v: results["locations"][name]["analysis"][v]["status"] for v in VARIABLES})


if __name__ == "__main__":
    run_cli()
