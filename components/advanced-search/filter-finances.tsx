"use client";

import DualRangeSlider from "#components-ui/dual-range-slider";
import { SimpleSeparator } from "#components-ui/horizontal-separator";
import constants from "#models/constants";
import { formatCurrency } from "#utils/helpers";
import { useState } from "react";

// Discretize "chiffre d'affaires" possible values
export const CA = [
  0, 1000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000,
  50000000000, 100000000000,
];

// Discretize "resultat net" possible values
export const Res = [
  -100000000000, -50000000000, -1000000000, -100000000, -1000000, 0, 100000,
  1000000, 10000000, 100000000, 1000000000, 10000000000, 50000000000,
  100000000000,
];

/**
 * Find the closest value amongst discretized values and return index
 *
 * @param values
 * @param defaultValue
 * @param value
 * @returns
 */
const findNearestValueIndex = (
  values: number[],
  defaultValue: number,
  value?: number | null
) => {
  if (typeof value === "undefined" || value === null) {
    return defaultValue;
  }

  for (let i = 0; i < values.length - 1; i++) {
    if (value <= values[i]) {
      return i;
    }
  }

  return values.length - 1;
};

export const FilterFinances: React.FC<{
  ca_min?: number | null;
  ca_max?: number | null;
  res_min?: number | null;
  res_max?: number | null;
}> = ({ ca_min, ca_max, res_min, res_max }) => {
  const [valueCA, setValueCA] = useState({
    min: findNearestValueIndex(CA, 0, ca_min),
    max: findNearestValueIndex(CA, CA.length - 1, ca_max),
  });

  const [valueRes, setValueRes] = useState({
    min: findNearestValueIndex(Res, 0, res_min),
    max: findNearestValueIndex(Res, Res.length - 1, res_max),
  });

  return (
    <>
      {valueCA.min > 0 && (
        <>
          <label htmlFor="ca-min-input" className="fr-label fr-sr-only">
            Chiffre d&apos;affaires minimum
          </label>
          <input
            id="ca-min-input"
            name="ca_min"
            value={CA[valueCA.min]}
            type="hidden"
            onChange={() => {}}
          />
        </>
      )}
      {valueCA.max < CA.length - 1 && (
        <>
          <label htmlFor="ca-max-input" className="fr-label fr-sr-only">
            Chiffre d&apos;affaires maximum
          </label>
          <input
            id="ca-max-input"
            name="ca_max"
            value={CA[valueCA.max]}
            type="hidden"
            onChange={() => {}}
          />
        </>
      )}
      {valueRes.min > 0 && (
        <>
          <label htmlFor="res-min-input" className="fr-label fr-sr-only">
            Résultat net minimum
          </label>
          <input
            id="res-min-input"
            name="res_min"
            value={Res[valueRes.min]}
            type="hidden"
            onChange={() => {}}
          />
        </>
      )}
      {valueRes.max < Res.length - 1 && (
        <>
          <label htmlFor="res-max-input" className="fr-label fr-sr-only">
            Résultat net maximum
          </label>
          <input
            id="res-max-input"
            name="res_max"
            value={Res[valueRes.max]}
            type="hidden"
            onChange={() => {}}
          />
        </>
      )}
      <fieldset>
        <legend>Chiffre d‘affaires :</legend>
        <DualRangeSlider
          idPrefix="ca"
          label="Chiffre d‘affaires"
          min={0}
          max={CA.length - 1}
          step={1}
          defaultValue={valueCA}
          onChange={setValueCA}
          color={constants.chartColors[4]}
        />
      </fieldset>
      <div className="legend">
        <span>Min : {formatCurrency(CA[valueCA.min])}</span>
        <span>Max : {formatCurrency(CA[valueCA.max])}</span>
      </div>
      <SimpleSeparator />
      <fieldset>
        <legend>Résultat net :</legend>
        <DualRangeSlider
          idPrefix="res"
          label="Résultat net"
          min={0}
          max={Res.length - 1}
          step={1}
          defaultValue={valueRes}
          onChange={setValueRes}
          color={constants.chartColors[1]}
        />
      </fieldset>
      <div className="legend">
        <span>Min : {formatCurrency(Res[valueRes.min])}</span>
        <span>Max : {formatCurrency(Res[valueRes.max])}</span>
      </div>

      <style jsx>{`
        .legend {
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
        fieldset {
          border: none;
          padding: 0;
          margin: 0;
        }
        legend {
          padding: 0;
          margin: 0;
          font-weight: 500;
          display: block;
          width: 100%;
        }
      `}</style>
    </>
  );
};
