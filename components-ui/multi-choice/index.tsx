import constants from '#models/constants';

interface IProps {
  values: { label: string; value: string }[];
  legend?: string;
  idPrefix?: string;
  name?: string;
  required?: boolean;
  centered?: boolean;
  large?: boolean;
  links?: boolean;
}

export const MultiChoice: React.FC<IProps> = ({
  values,
  legend = '',
  idPrefix = '',
  name = '',
  required = false,
  large = false,
  links = false,
}) => (
  <>
    {legend && (
      <legend>
        <h2>{legend}</h2>
      </legend>
    )}

    <div className="radio-group rating">
      {values.map(({ label, value }, index) => (
        <div>
          {links ? (
            <a href={value}>{label}</a>
          ) : (
            <>
              <input
                type="radio"
                id={`${idPrefix}-${index}`}
                name={name}
                value={value}
                required={required}
              />
              <label className="fr-label" htmlFor={`${idPrefix}-${index}`}>
                {label}
              </label>
            </>
          )}
        </div>
      ))}
    </div>

    <style jsx>
      {`
        .radio-group {
          display: flex;
          flex-wrap: wrap;
          justify-content: ${large ? 'center' : 'start'};
        }

        .radio-group > div > label,
        .radio-group > div > a {
          display: block;
          border: 2px solid transparent;
          border-radius: 6px;
          background: #e5e5f4;
          padding: 4px 10px;
          color: ${constants.colors.frBlue};

          font-weight: ${large ? 'bold' : 'inherit'};
          font-size: ${large ? '2rem' : '1rem'};
          line-height: ${large ? '3rem' : '1.5rem'};
          margin: ${large ? '15px 10px' : '5px'};
        }

        .radio-group > div > input {
          opacity: 0;
          height: 0;
          width: 0;
          position: absolute;
        }

        input[type='radio']:hover + label,
        .radio-group > div > a:hover {
          border: 2px dashed ${constants.colors.frBlue};
        }
        input[type='radio']:checked + label {
          border: 2px solid ${constants.colors.frBlue};
        }

        h2 {
          font-size: 1.3rem;
        }
      `}
    </style>
  </>
);
