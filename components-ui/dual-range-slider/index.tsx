import constants from '#models/constants';
import { useEffect, useState } from 'react';

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
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
  color?: string;
  samePositionAllowed?: boolean;
  disabled?: boolean;
}> = ({
  idPrefix,
  label,
  min,
  max,
  value,
  step,
  onChange,
  color = constants.colors.frBlue,
  samePositionAllowed = false,
  disabled = false,
}) => {
  const [minValue, setMinValue] = useState(value ? value.min : min);
  const [maxValue, setMaxValue] = useState(value ? value.max : max);

  useEffect(() => {
    if (value) {
      setMinValue(value.min);
      setMaxValue(value.max);
    }
  }, [value]);

  const handleMinChange = (e: any) => {
    e.preventDefault();
    let newMinVal = Math.min(+e.target.value, maxValue - step);
    if (samePositionAllowed) {
      newMinVal = +e.target.value;
    }

    if (!value) {
      setMinValue(newMinVal);
    }
    onChange({ min: newMinVal, max: maxValue });
  };

  const handleMaxChange = (e: any) => {
    e.preventDefault();
    let newMaxVal = Math.max(+e.target.value, minValue + step);
    if (samePositionAllowed) {
      newMaxVal = +e.target.value;
    }

    if (!value) {
      setMaxValue(newMaxVal);
    }
    onChange({ min: minValue, max: newMaxVal });
  };

  const minPos = ((minValue - min) / (max - min)) * 100;
  const maxPos = ((maxValue - min) / (max - min)) * 100;

  return (
    <div id="dual-range-slider">
      <div className="input-wrapper">
        <label
          htmlFor={`${idPrefix}-min-range-input`}
          className="fr-label fr-sr-only"
        >
          {label} minimum
        </label>
        <input
          id={`${idPrefix}-min-range-input`}
          type="range"
          value={minValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMinChange}
          disabled={disabled}
        />
        <label
          htmlFor={`${idPrefix}-max-range-input`}
          className="fr-label fr-sr-only"
        >
          {label} maximum
        </label>
        <input
          id={`${idPrefix}-max-range-input`}
          type="range"
          value={maxValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMaxChange}
          disabled={disabled}
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
          cursor: ${disabled ? 'not-allowed' : 'grab'};
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
          cursor: ${disabled ? 'not-allowed' : 'grab'};
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
          cursor: ${disabled ? 'not-allowed' : 'grab'};
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
          background: ${disabled ? '#e5e5e5' : color};
        }

        .control {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          position: absolute;
          background: #fff;
          border: 2px solid ${disabled ? '#e5e5e5' : color};
          margin-left: -10px;
          z-index: 2;
        }
      `}</style>
    </div>
  );
};

export default DualRangeSlider;
