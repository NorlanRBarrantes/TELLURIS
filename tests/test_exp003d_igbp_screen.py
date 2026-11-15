"""MCD12Q1 IGBP parsing and limits."""
import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"analysis"))
import exp003d_igbp_screen as m

class IGBPTests(unittest.TestCase):
    def sample(self,code):
        return {"nrows":1,"ncols":1,"cellsize":"463.312716528","subset":[{
            "band":"LC_Type1","modis_date":"A2023001","data":[code],"version":"061"
        }]}
    def test_evergreen_is_natural_candidate_not_stable_forest(self):
        x=m.parse_class(self.sample(2))
        self.assertEqual(x["cover_kind"],"natural_vegetation_candidate")
        self.assertEqual(x["code"],2)
    def test_urban_is_not_natural(self):
        self.assertFalse(m.parse_class(self.sample(13))["is_natural_vegetation_candidate"])
    def test_cropland_not_called_natural_forest(self):
        self.assertFalse(m.parse_class(self.sample(12))["is_natural_vegetation_candidate"])
    def test_mixed_cultivation_not_called_natural(self):
        self.assertFalse(m.parse_class(self.sample(14))["is_natural_vegetation_candidate"])
    def test_water_not_natural(self):
        self.assertEqual(m.parse_class(self.sample(17))["cover_kind"],"water")
    def test_fill_not_valid(self):
        self.assertEqual(m.parse_class(self.sample(255))["cover_kind"],"unknown_or_fill")
    def test_duplicate_bands_rejected(self):
        d=self.sample(2);d["subset"]*=2
        with self.assertRaises(ValueError):m.parse_class(d)
    def test_grid_mismatch_rejected(self):
        d=self.sample(2);d["ncols"]=3
        with self.assertRaises(ValueError):m.parse_class(d)

if __name__=="__main__":
    unittest.main()
