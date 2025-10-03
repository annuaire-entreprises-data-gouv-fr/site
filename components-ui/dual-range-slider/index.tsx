import { useState } from "react";
import constants from "#models/constants";

/**
 * Component with dual slider
 * Composed of two native sliders
 *
 * Use with react !
 */
const DualRangeSlider: React.FC<{
  idPrefix: string;
  label: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: { min: number; max: number }) => void;
  defaultValue?: { min: number; max: number };
  color?: string;
  samePositionAllowed?: boolean;
  disabled?: boolean;
  disabledColor?: boolean;
}> = ({
  idPrefix,
  label,
  min,
  max,
  step,
  onChange,
  defaultValue,
  color = constants.colors.frBlue,
  samePositionAllowed = false,
  disabled = false,
  disabledColor = false,
}) => {
  const [minValue, setMinValue] = useState(defaultValue?.min ?? min);
  const [maxValue, setMaxValue] = useState(defaultValue?.max ?? max);

  const handleMinChange = (e: any) => {
    e.preventDefault();
    let newMinVal = Math.min(+e.target.value, maxValue - step);
    if (samePositionAllowed) {
      newMinVal = +e.target.value;
    }

    setMinValue(newMinVal);
    const min = newMinVal <= maxValue ? newMinVal : maxValue;
    const max = newMinVal > maxValue ? newMinVal : maxValue;
    onChange({ min, max });
  };

  const handleMaxChange = (e: any) => {
    e.preventDefault();
    let newMaxVal = Math.max(+e.target.value, minValue + step);
    if (samePositionAllowed) {
      newMaxVal = +e.target.value;
    }

    setMaxValue(newMaxVal);
    const min = minValue <= newMaxVal ? minValue : newMaxVal;
    const max = minValue > newMaxVal ? minValue : newMaxVal;
    onChange({ min, max });
  };

  const minPos = ((minValue - min) / (max - min)) * 100;
  const maxPos = ((maxValue - min) / (max - min)) * 100;

  return (
    <div id="dual-range-slider">
      <div className="input-wrapper">
        <label
          className="fr-label fr-sr-only"
          htmlFor={`${idPrefix}-min-range-input`}
        >
          {label} minimum
        </label>
        <input
          disabled={disabled}
          id={`${idPrefix}-min-range-input`}
          max={max}
          min={min}
          onChange={handleMinChange}
          step={step}
          type="range"
          value={minValue}
        />
        <label
          className="fr-label fr-sr-only"
          htmlFor={`${idPrefix}-max-range-input`}
        >
          {label} maximum
        </label>
        <input
          disabled={disabled}
          id={`${idPrefix}-max-range-input`}
          max={max}
          min={min}
          onChange={handleMaxChange}
          step={step}
          type="range"
          value={maxValue}
        />
      </div>

      <div className="control-wrapper">
        <div className="control" style={{ left: `${minPos}%` }} />
        <div className="rail">
          <div
            className="inner-rail"
            style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
          />
        </div>
        <div className="control" style={{ left: `${maxPos}%` }} />
      </div>
      <style jsx>{`
        #dual-range-slider {
          position: relative;
          display: flex;
          align-items: center;
          margin: 20px 10px 0;
        }

        .input-wrapper {
          width: calc(100% + 20px);
          margin: 0 -10px;
          position: absolute;
          height: 20px;
        }

        .control-wrapper {
          width: 100%;
          position: absolute;
          height: 20px;
        }

        input[type='range'] {
          position: absolute;
          width: 100%;
          pointer-events: none;
          appearance: none;
          height: 100%;
          opacity: 0;
          z-index: 3;
          padding: 0;
        }
        input[type='range']::-ms-track {
          appearance: none;
          background: transparent;
          border: transparent;
        }

        input[type='range']::-moz-range-track {
          appearance: none;
          background: transparent;
          border: transparent;
        }

        input[type='range']:focus::-webkit-slider-runnable-track {
          appearance: none;
          background: transparent;
          border: transparent;
        }

        input[type='range']::-ms-thumb {
          appearance: none;
          pointer-events: all;
          width: 35px;
          height: 35px;
          border-radius: 0px;
          border: 0 none;
          cursor: ${disabled ? "not-allowed" : "grab"};
          background-color: red;
        }

        input[type='range']::-ms-thumb:active {
          cursor: grabbing;
        }

        input[type='range']::-moz-range-thumb {
          appearance: none;
          pointer-events: all;
          width: 35px;
          height: 35px;
          border-radius: 0px;
          border: 0 none;
          cursor: ${disabled ? "not-allowed" : "grab"};
          background-color: red;
        }

        input[type='range']::-moz-range-thumb:active {
          cursor: grabbing;
        }

        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          pointer-events: all;
          width: 35px;
          height: 35px;
          border-radius: 0px;
          border: 0 none;
          cursor: ${disabled ? "not-allowed" : "grab"};
          background-color: red;
        }

        input[type='range']::-webkit-slider-thumb:active {
          cursor: grabbing;
        }

        .rail {
          position: absolute;
          width: 100%;
          top: 50%;
          transform: translateY(-50%);
          height: 3px;
          border-radius: 3px;
          background: lightgrey;
        }

        .inner-rail {
          position: absolute;
          height: 100%;
          background: ${disabledColor ? "#e5e5e5" : color};
        }

        .control {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          position: absolute;
          background: #fff;
          border: 2px solid ${disabledColor ? "#e5e5e5" : color};
          margin-left: -10px;
          z-index: 2;
        }
      `}</style>
    </div>
  );
};

export default DualRangeSlider;
