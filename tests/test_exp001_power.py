import importlib.util
from pathlib import Path
import pytest
import numpy as np

path = Path(__file__).resolve().parents[1] / "analysis" / "exp001_power.py"
spec = importlib.util.spec_from_file_location("exp001", path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


def make_payload(start=2023, end=2024, temperature=25.0, precipitation=2.0, fill=-999.0):
    params = {"T2M": {}, "PRECTOTCORR": {}}
    for year in range(start, end + 1):
        for month in range(1, 13):
            key = f"{year}{month:02d}"
            params["T2M"][key] = temperature
            params["PRECTOTCORR"][key] = precipitation
        params["T2M"][f"{year}13"] = 99.0
        params["PRECTOTCORR"][f"{year}13"] = 99.0
    return {"properties": {"parameter": params}, "parameters": {
        "T2M": {"units": "C"}, "PRECTOTCORR": {"units": "mm/day"}},
        "header": {"fill_value": fill, "sources": ["MERRA2"]},
        "geometry": {"coordinates": [-85.44, 10.63, 140.0]}}


def test_month13_excluded_and_leap_year_weighting():
    v = mod.parse_annual(make_payload(), 2023, 2024)
    assert v["qa"]["annual_summary_keys_ignored"] == {"T2M": 2, "PRECTOTCORR": 2}
    assert v["annual"]["T2M"] == {2023: 25.0, 2024: 25.0}
    assert v["annual"]["PRECTOTCORR"] == {2023: 730.0, 2024: 732.0}


def test_missing_precipitation_does_not_erase_valid_temperature():
    p = make_payload()
    p["properties"]["parameter"]["PRECTOTCORR"]["202312"] = -999.0
    v = mod.parse_annual(p, 2023, 2024)
    assert 2023 in v["annual"]["T2M"]
    assert 2023 not in v["annual"]["PRECTOTCORR"]
    assert v["qa"]["incomplete_years"]["PRECTOTCORR"] == [2023]


def test_missing_month_key_caught_and_negative_temperature_allowed():
    p = make_payload(2024, 2024, temperature=-12.0)
    del p["properties"]["parameter"]["T2M"]["202402"]
    v = mod.parse_annual(p, 2024, 2024)
    assert v["annual"]["T2M"] == {}
    assert v["annual"]["PRECTOTCORR"] == {2024: 732.0}
    assert "202402" in v["qa"]["missing_months"]["T2M"]


def test_reject_wrong_units_instead_of_assuming():
    p = make_payload()
    p["parameters"]["PRECTOTCORR"]["units"] = "mm/hr"
    with pytest.raises(ValueError, match="Unexpected PRECTOTCORR"):
        mod.parse_annual(p, 2023, 2024)


def test_missing_metadata_is_a_failure():
    p = make_payload()
    del p["header"]["fill_value"]
    with pytest.raises(ValueError, match="metadata"):
        mod.parse_annual(p, 2023, 2024)


def test_negative_precip_is_invalid_not_an_universal_low_cutoff():
    p = make_payload(2024, 2024, temperature=-5)
    p["properties"]["parameter"]["PRECTOTCORR"]["202410"] = -0.1
    v = mod.parse_annual(p, 2024, 2024)
    assert v["annual"]["T2M"] == {2024: -5.0}
    assert v["annual"]["PRECTOTCORR"] == {}


def test_sparse_or_empty_data_returns_status_instead_of_crashing():
    p = make_payload(2023, 2024)
    one = {"payload": p, "origin": "synthetic test fixture"}
    r = mod.compute_report({"Liberia": one, "Limon": one}, 1985, 2025)
    assert r["locations"]["Liberia"]["analysis"]["T2M"]["status"] == "insufficient_years"
    assert r["paired_difference"]["T2M"]["analysis"]["status"] == "insufficient_years"


def test_mann_kendall_known_constant_and_increasing_trend():
    flat = mod.mann_kendall_independent([3] * 20)
    assert flat["p_value"] == 1.0 and flat["z"] == 0
    inc = mod.mann_kendall_independent(list(range(20)))
    assert inc["s"] == 190 and inc["p_value"] < 0.01
    assert mod.analyze({y: float(y - 2000) for y in range(2001, 2021)})["trend"]["slope_per_decade"] == pytest.approx(10.0)


def test_sen_robust_to_single_large_outlier_and_annual_year_axis():
    years = list(range(2000, 2025))
    vals = {y: 0.15 * (y - 2000) for y in years}
    vals[2010] += 200.0
    result = mod.analyze(vals)
    assert result["trend"]["slope_per_decade"] == pytest.approx(1.5)
    assert result["status"] == "exploratory_independence_not_established"


def test_unequal_missing_years_are_aligned_for_paired_difference():
    p1 = make_payload(2000, 2014)
    p2 = make_payload(2000, 2014)
    p1["properties"]["parameter"]["PRECTOTCORR"]["200712"] = -999
    p2["properties"]["parameter"]["PRECTOTCORR"]["200912"] = -999
    r = mod.compute_report({"Liberia": {"payload": p1}, "Limon": {"payload": p2}}, 2000, 2014)
    years = r["paired_difference"]["PRECTOTCORR"]["common_years"]
    assert len(years) == 13 and 2007 not in years and 2009 not in years
    assert len(r["paired_difference"]["T2M"]["common_years"]) == 15


def test_invalid_coordinate_and_year_params_are_rejected():
    with pytest.raises(ValueError):
        mod.build_url(91, 0, 1985, 2025, "RE")
    with pytest.raises(ValueError):
        mod.build_url(10, -85, 2025, 1985, "RE")
