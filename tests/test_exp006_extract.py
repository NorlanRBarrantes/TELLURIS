import tempfile
import unittest
from pathlib import Path
from importlib.util import spec_from_file_location,module_from_spec
import numpy as np
import h5py

source=Path(__file__).resolve().parents[1]/"analysis"/"exp006_extract_imerg.py"
spec=spec_from_file_location("exp006_extract",source)
m=module_from_spec(spec)
spec.loader.exec_module(m)

class GPMExtractTests(unittest.TestCase):
    def example(self,folder,month=1,unit="mm/hr"):
        name=f"3B-MO.MS.MRG.3IMERG.2023{month:02d}01-S000000-E235959.{month:02d}.V07B.HDF5"
        p=Path(folder)/name
        with h5py.File(p,"w") as f:
            grid=f.create_group("Grid")
            grid["lat"]=np.array([10.55,10.65,10.75])
            grid["lon"]=np.array([-85.55,-85.45,-85.35,-85.25])
            rain=grid.create_dataset("precipitation",data=np.full((1,4,3),2.,dtype="f4"))
            rain.attrs["units"]=unit
        return p
    def test_original_source_pixel_and_hash(self):
        with tempfile.TemporaryDirectory() as d:
            p=self.example(d)
            rec,center,v=m.source_cell(p,10.63,-85.44)
            self.assertEqual(rec["precipitationMmHr"],2)
            self.assertEqual(rec["month"],"2023-01")
            self.assertEqual(center,[10.65,-85.45])
            self.assertEqual(v,"V07B")
            self.assertEqual(len(rec["sha256"]),64)
    def test_wrong_unit_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            p=self.example(d,unit="mm/day")
            with self.assertRaises(ValueError):m.source_cell(p,10.63,-85.44)
    def test_mixed_versions_not_silently_combined(self):
        with tempfile.TemporaryDirectory() as d:
            a=self.example(d,1);b=self.example(d,2)
            b2=Path(str(b).replace("V07B","V07A"));b.rename(b2)
            with self.assertRaises(ValueError):m.convert([a,b2],10.63,-85.44)
    def test_wrong_location_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            p=self.example(d)
            with self.assertRaises(ValueError):m.source_cell(p,9.99,-83.03)
    def test_two_original_granules_produce_manifest(self):
        with tempfile.TemporaryDirectory() as d:
            a=self.example(d,1);b=self.example(d,2)
            manifest=m.convert([a,b],10.63,-85.44)
            self.assertEqual(manifest["dataset"],"GPM_3IMERGM_07")
            self.assertEqual(len(manifest["records"]),2)

if __name__=="__main__":unittest.main()
