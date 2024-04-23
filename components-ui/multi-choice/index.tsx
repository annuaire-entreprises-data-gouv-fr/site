'use client';

import { ChangeEventHandler } from 'react';
import styles from './style.module.css';

export type IProps = {
  values: {
    label: string;
    value?: string;
    onClick?: ChangeEventHandler<HTMLInputElement>;
    href?: string;
    checked?: boolean;
  }[];
  legend?: string;
  idPrefix?: string;
  name?: string;
  required?: boolean;
  centered?: boolean;
  large?: boolean;
  links?: boolean;
};

const onKeyDown = (event: any, onclick?: Function) => {
  if (event.keyCode === 13 && onclick) {
    onclick();
  }
};

export const MultiChoice: React.FC<IProps> = ({
  values,
  legend = '',
  idPrefix = '',
  name = '',
  required = false,
  large = false,
}) => (
  <>
    {legend && (
      <legend>
        <h2 style={{ fontSize: '1.2rem' }}>{legend}</h2>
      </legend>
    )}

    <div
      className={styles['radio-group']}
      style={{
        justifyContent: large ? 'center' : 'flex-start',
      }}
    >
      {values.map(({ label, value, href, onClick, checked = false }, index) => (
        <div key={href || value || label}>
          {href ? (
            <a tabIndex={0} href={href} style={computeStyle(large)}>
              {label}
            </a>
          ) : (
            <>
              <input
                type="radio"
                id={`${idPrefix}-${index}`}
                name={name}
                value={value}
                required={required}
                onChange={!!onClick ? onClick : undefined}
                checked={!!onClick ? checked : undefined}
                defaultChecked={!!onClick ? undefined : checked}
                tabIndex={-1}
              />
              <label
                tabIndex={0}
                style={computeStyle(large)}
                onKeyDown={(e) => onKeyDown(e, onClick)}
                className="fr-label"
                htmlFor={`${idPrefix}-${index}`}
              >
                {label}
              </label>
            </>
          )}
        </div>
      ))}
    </div>
  </>
);

function computeStyle(large: boolean) {
  return {
    fontWeight: large ? 'bold' : 'inherit',
    fontSize: large ? '2rem' : '1rem',
    lineHeight: large ? '3rem' : '1.5rem',
    margin: large ? '15px 10px' : '5px',
  };
}
