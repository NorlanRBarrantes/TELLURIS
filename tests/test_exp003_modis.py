"""Deterministic EXP-003 QA and source-parser regressions."""
from pathlib import Path
import sys
import unittest

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'analysis'))
import exp003_modis as exp


class MODISExp003Tests(unittest.TestCase):
    def setUp(self):
        self.metadata=exp.find_metadata({'bands':[
            {'band':'250m_16_days_NDVI','scale_factor':'0.0001',
             'fill_value':'-3000','valid_range':'-2000 to 10000'},
            {'band':'250m_16_days_EVI','scale_factor':'0.0001',
             'fill_value':'-3000','valid_range':'-2000 to 10000'},
            {'band':'250m_16_days_pixel_reliability',
             'fill_value':'-1','valid_range':'0 to 3'}
        ]})

    def sample(self,qa=0,raw=-2000):
        d='A2023001'
        return {'nrows':1,'ncols':1,'subset':[
            {'band':'250m_16_days_NDVI','modis_date':d,'data':[raw]},
            {'band':'250m_16_days_EVI','modis_date':d,'data':[1700]},
            {'band':'250m_16_days_pixel_reliability','modis_date':d,'data':[qa]}
        ]}

    def test_minus_2000_is_valid_inclusive(self):
        v=exp.subset_samples(self.sample(),{'A2023001'},self.metadata)['A2023001']
        self.assertEqual(v['NDVI'],-.2)
        self.assertEqual(v['EVI'],.17)

    def test_quality_rank_3_excludes_numeric_data(self):
        v=exp.subset_samples(self.sample(3),{'A2023001'},self.metadata)['A2023001']
        self.assertIsNone(v['NDVI'])
        self.assertIsNone(v['EVI'])

    def test_quality_rank_1_allowed_but_traced(self):
        v=exp.subset_samples(self.sample(1,6500),{'A2023001'},self.metadata)['A2023001']
        self.assertEqual(v['qa'],1)
        self.assertEqual(v['NDVI'],.65)

    def test_fill_not_scaled(self):
        v=exp.subset_samples(self.sample(0,-3000),{'A2023001'},self.metadata)['A2023001']
        self.assertIsNone(v['NDVI'])

    def test_reject_wrong_grid_size(self):
        sample=self.sample()
        sample['ncols']=3
        with self.assertRaises(ValueError):
            exp.subset_samples(sample,{'A2023001'},self.metadata)

    def test_reject_missing_reliability_band(self):
        sample=self.sample()
        sample['subset'].pop()
        with self.assertRaises(ValueError):
            exp.subset_samples(sample,{'A2023001'},self.metadata)

    def test_annual_median_rejects_seasonal_cloud_bias(self):
        rows=[{'calendar_date':f'2023-{m:02d}-{d:02d}',
               'NDVI':.7 if m<=6 else None,
               'EVI':.5 if m<=6 else None} for m in range(1,13) for d in (1,16)]
        out=exp.annual_summary(rows,2023,2023)
        self.assertEqual(out['NDVI'][0]['n_valid_composites'],12)
        self.assertIsNone(out['NDVI'][0]['annual_median'])

    def test_annual_median_needs_all_quarters(self):
        rows=[{'calendar_date':f'2023-{m:02d}-01',
               'NDVI':.5,'EVI':.6} for m in range(1,13)]
        out=exp.annual_summary(rows,2023,2023)
        self.assertEqual(out['NDVI'][0]['annual_median'],.5)
        self.assertEqual(out['NDVI'][0]['status'],'accepted')

    def test_dates_response_envelope(self):
        out=exp.unpack_dates({'dates':[{'modis_date':'A2023001',
                  'calendar_date':'2023-01-01'}]},2023,2025)
        self.assertEqual(len(out),1)

    def test_bad_source_scale_fails_closed(self):
        changed=[self.metadata[key].copy() for key in
                 ('250m_16_days_NDVI','250m_16_days_EVI',exp.QA_BAND)]
        changed[0]['scale_factor']='0.001'
        with self.assertRaises(ValueError):
            exp.find_metadata({'bands':changed})


if __name__=='__main__':
    unittest.main()
