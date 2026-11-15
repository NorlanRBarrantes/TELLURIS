"""EXP-003 detailed MODIS QA methodological regression tests."""
import unittest
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"analysis"))
import audit_mod13q1_methodology as m

class TestMODISMethod(unittest.TestCase):
    def test_valid_land_good(self):
        self.assertEqual(m.reject_reasons(0,1<<11),[])
    def test_marginal_clean(self):
        self.assertEqual(m.reject_reasons(1,(1<<11)|1),[])
    def test_flags_bad_even_if_summary_good(self):
        self.assertIn("shadow",m.reject_reasons(0,(1<<11)|(1<<15)))
    def test_clouds_aerosol_and_shadow(self):
        for bit,reason in [(10,"mixed_cloud"),(8,"adjacent_cloud"),(15,"shadow")]:
            self.assertIn(reason,m.reject_reasons(1,(1<<11)|(1<<bit)))
        self.assertIn("high_aerosol",m.reject_reasons(1,(1<<11)|(3<<6)))
    def test_non_land_and_fill_rejected(self):
        self.assertIn("not_unambiguously_land",m.reject_reasons(0,2<<11))
        self.assertIn("invalid_detail",m.reject_reasons(0,-1))
        self.assertIn("invalid_detail",m.reject_reasons(0,65535))
    def test_no_usefulness_shortcut(self):
        self.assertEqual(m.reject_reasons(0,(1<<11)|(15<<2)),[])
    def test_valid_endpoints_scaled(self):
        self.assertEqual(m.scaled(-2000),-.2)
        self.assertEqual(m.scaled(10000),1)
        self.assertIsNone(m.scaled(-3000))
    def test_solar_angle(self):
        self.assertEqual(m.solar_angle(3250),32.5)
        self.assertIsNone(m.solar_angle(-10000))
    def test_no_reference_climatology_from_three_years(self):
        rows=[{"year":y,"cycle":0,"quarter":0,"NDVI_strict":.6} for y in (2023,2024,2025)]
        result=m.seasonal_anomaly(rows,"NDVI_strict")
        self.assertEqual(result["reference_cycles"],0)
        self.assertTrue(all(v["anomaly_mean"] is None for v in result["years"]))
    def test_seasonally_fixed_synthetic_curve(self):
        rows=[]
        for y in range(2000,2012):
            for c in range(23):
                if y>=2006 and c in (17,18,19,20):continue
                rows.append({"year":y,"cycle":c,"quarter":min(3,c//6),
                             "EVI_strict":round(.25+c*.02,6)})
        result=m.seasonal_anomaly(rows,"EVI_strict")
        self.assertEqual(result["reference_cycles"],23)
        self.assertTrue(all(abs(v["anomaly_mean"])<1e-9 for v in result["years"]))
    def test_unbalanced_annual_coverage(self):
        rows=[{"quarter":i//3,"NDVI_strict":.5} for i in range(12)]
        self.assertTrue(m.summarize_coverage(rows,"NDVI_strict",12,per_quarter=2)["eligible"])
        for row in rows[:3]:row["NDVI_strict"]=None
        self.assertFalse(m.summarize_coverage(rows,"NDVI_strict",12,per_quarter=2)["eligible"])
        self.assertTrue(m.summarize_coverage(rows,"NDVI_strict",8,quarters=3)["eligible"])
    def test_all_original_bands_required(self):
        import json,tempfile
        with tempfile.TemporaryDirectory() as name:
            folder=Path(name)
            (folder/"batch_001.json").write_text(json.dumps({
              "nrows":1,"ncols":1,"subset":[{"modis_date":"A2023001",
              "band":m.MEASURES["NDVI"],"data":[1000]}]}),encoding="utf-8")
            with self.assertRaises(ValueError):
                m.load_originals(folder)

if __name__=="__main__":
    unittest.main()
