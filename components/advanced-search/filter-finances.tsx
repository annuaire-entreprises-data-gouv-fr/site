import { useState } from 'react';
import DualRangeSlider from '#components-ui/dual-range-slider';
import { formatCurrency } from '#utils/helpers';
import { SimpleSeparator } from '#components-ui/horizontal-separator';
import constants from '#models/constants';

export const FilterFinances: React.FC<{}> = () => {
  const CA = [
    0, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000,
    100000000000,
  ];

  const Res = [
    -100000000000, -1000000000, -100000000, -1000000, 0, 100000, 1000000,
    10000000, 100000000, 1000000000, 10000000000, 100000000000,
  ];

  const [valueCA, setValueCA] = useState({ min: 0, max: CA.length - 1 });
  const [valueRes, setValueRes] = useState({ min: 0, max: Res.length - 1 });

  return (
    <>
      <input
        name="ca_min"
        value={valueCA.min}
        type="hidden"
        onChange={() => {}}
      />
      <input
        name="ca_max"
        value={valueCA.max}
        type="hidden"
        onChange={() => {}}
      />
      <input
        name="res_min"
        value={valueCA.min}
        type="hidden"
        onChange={() => {}}
      />
      <input
        name="res_max"
        value={valueCA.max}
        type="hidden"
        onChange={() => {}}
      />
      <label>Chiffre d’affaires :</label>
      <DualRangeSlider
        min={0}
        max={CA.length - 1}
        value={valueCA}
        step={1}
        onChange={setValueCA}
        color={constants.chartColors[4]}
      />
      <div className="legend">
        <span>Min : {formatCurrency(CA[valueCA.min])}</span>
        <span>Max : {formatCurrency(CA[valueCA.max])}</span>
      </div>
      <SimpleSeparator />
      <label>Résultat net :</label>
      <DualRangeSlider
        min={0}
        max={Res.length - 1}
        value={valueRes}
        step={1}
        onChange={setValueRes}
        color={constants.chartColors[1]}
      />
      <div className="legend">
        <span>Min : {formatCurrency(Res[valueRes.min])}</span>
        <span>Max : {formatCurrency(Res[valueRes.max])}</span>
      </div>

      <style jsx>{`
        .legend {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
      `}</style>
    </>
  );
};
