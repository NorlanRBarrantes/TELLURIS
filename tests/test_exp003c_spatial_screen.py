"""Synthetic and NASA-shaped regression fixtures for blind spatial screening."""
import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"analysis"))
import exp003c_spatial_screen as s

class SpatialScreenTests(unittest.TestCase):
    def test_nominal_grid_is_only_diagnostic(self):
        self.assertTrue(s.nominal_grid(9.885,-83.135))
        self.assertTrue(s.nominal_grid(9.965,-83.115))
        self.assertFalse(s.nominal_grid(9.671,-83.024))
        self.assertTrue(s.nominal_grid(9.99,-83.03))
    def test_9x9_center_3x3_unique(self):
        center,indices=s.center_and_neighbors(9,9)
        self.assertEqual(center,40)
        self.assertEqual(indices,[30,31,32,39,40,41,48,49,50])
        self.assertEqual(len(set(indices)),9)
    def test_even_grid_is_rejected(self):
        with self.assertRaises(ValueError):s.center_and_neighbors(8,8)
    def sample(self,central_coast=False):
        N=81
        quality=[1<<11]*N
        if central_coast:quality[40]=2<<11
        ndvi=[6000]*N
        rel=[0]*N
        def entry(band,data):
            return {"band":band,"data":data,"modis_date":"A2023001"}
        return {"nrows":9,"ncols":9,"subset":[
          entry("250m_16_days_VI_Quality",quality),
          entry("250m_16_days_pixel_reliability",rel),
          entry("250m_16_days_NDVI",ndvi),
          entry("250m_16_days_EVI",[5000]*N)]}
    def test_all_land_was_eligible_single_date_only(self):
        out=s.extract_spatial(self.sample(),"A2023001")
        self.assertEqual(out["center_3x3_land_cells"],9)
        self.assertEqual(out["center_3x3_strict_qa_and_valid_indices"],9)
        self.assertTrue(out["single_date_spatial_median_eligible_proposal"])
    def test_coastal_center_cannot_be_land_labeled(self):
        out=s.extract_spatial(self.sample(central_coast=True),"A2023001")
        self.assertEqual(out["central_pixel"]["land_water_class"],2)
        self.assertEqual(out["center_3x3_land_cells"],8)
        self.assertFalse(out["central_pixel"]["both_indices_usable"])
    def test_shadow_and_cloud_rejected(self):
        ob=self.sample()
        for q in ob["subset"]:
            if q["band"]=="250m_16_days_VI_Quality":
                q["data"][41]|=1<<15
                q["data"][39]|=1<<10
        result=s.extract_spatial(ob,"A2023001")
        self.assertEqual(result["center_3x3_strict_qa_and_valid_indices"],7)
    def test_bad_grid_band_size(self):
        ob=self.sample()
        ob["subset"][0]["data"].pop()
        with self.assertRaises(ValueError):s.extract_spatial(ob,"A2023001")
    def test_no_trend_or_significance_selection_in_source(self):
        from inspect import getsource
        source=getsource(s.inspect)+getsource(s.extract_spatial)
        self.assertNotIn("theilslopes",source)
        self.assertNotIn("mannkendall",source)
        self.assertNotIn("linregress",source)

if __name__=="__main__":
    unittest.main()
