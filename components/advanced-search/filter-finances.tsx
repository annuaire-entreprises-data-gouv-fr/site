import { useState } from 'react';
import DualRangeSlider from '#components-ui/dual-range-slider';
import { formatCurrency } from '#utils/helpers';
import { SimpleSeparator } from '#components-ui/horizontal-separator';
import constants from '#models/constants';

export const CA = [
  0, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000,
  100000000000,
];

export const Res = [
  -100000000000, -1000000000, -100000000, -1000000, 0, 100000, 1000000,
  10000000, 100000000, 1000000000, 10000000000, 100000000000,
];

export const FilterFinances: React.FC<{
  ca_min?: number;
  ca_max?: number;
  res_min?: number;
  res_max?: number;
}> = ({ ca_min, ca_max, res_min, res_max }) => {
  const [valueCA, setValueCA] = useState({
    min: ca_min || 0,
    max: ca_max || CA.length - 1,
  });
  const [valueRes, setValueRes] = useState({
    min: res_min || 0,
    max: res_max || Res.length - 1,
  });

  return (
    <>
      {valueCA.min > 0 && (
        <input
          name="ca_min"
          value={valueCA.min}
          type="hidden"
          onChange={() => {}}
        />
      )}
      {valueCA.max < CA.length - 1 && (
        <input
          name="ca_max"
          value={valueCA.max}
          type="hidden"
          onChange={() => {}}
        />
      )}
      {valueRes.min > 0 && (
        <input
          name="res_min"
          value={valueRes.min}
          type="hidden"
          onChange={() => {}}
        />
      )}
      {valueRes.max < Res.length - 1 && (
        <input
          name="res_max"
          value={valueRes.max}
          type="hidden"
          onChange={() => {}}
        />
      )}
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
