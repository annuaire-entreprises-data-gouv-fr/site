import React, { PropsWithChildren } from 'react';
import NonRenseigne from '#components/non-renseigne';
import constants from '#models/constants';
import { InternalError } from '#models/exceptions';
import { logWarningInSentry } from '#utils/sentry';
import { CopyPaste } from './copy-paste';
import styles from './styleSimple.module.css';

interface ISectionProps {
  body: any[][];
  id?: string;
}

const Cell: React.FC<PropsWithChildren<{ label?: string }>> = ({
  children,
  label = '',
}) => {
  const isCopyEnabled = typeof children === 'string' && children !== '';
  return (
    <td className={styles.cell}>
      {isCopyEnabled ? (
        <CopyPaste label={label} shouldTrim={shouldTrim(label)}>
          {children}
        </CopyPaste>
      ) : (
        <div>
          <span>{children || <NonRenseigne />}</span>
        </div>
      )}
    </td>
  );
};

/**
 * Add a css class to customize copy to clipboard behaviour
 * @param label
 */
const shouldTrim = (label: any) => {
  try {
    // in case label is a JSX element we use the children as label
    // as this is likely to trigger an exception we use a try / catch
    const labelAsString = label?.props?.tooltipLabel || label || '';

    if (typeof labelAsString === 'object') {
      return false;
    }

    if (
      labelAsString.indexOf('TVA') > -1 ||
      labelAsString.indexOf('SIREN') > -1 ||
      labelAsString.indexOf('SIRET') > -1 ||
      labelAsString.indexOf('RNA') > -1
    ) {
      return true;
    }
    return false;
  } catch (e: any) {
    logWarningInSentry(
      new InternalError({ message: 'Error in shouldTrim', cause: e })
    );
    return false;
  }
};

/**
 * Two column tables
 * @param body two dimension array, null or undefined rows will be filtered
 * @returns
 */
export const TwoColumnTable: React.FC<ISectionProps> = ({ id, body }) => {
  return (
    <table className={styles['two-column-table']} id={id}>
      <tbody>
        {body.map((row, idx) => (
          <tr key={'a' + idx}>
            <td
              style={{
                borderColor: constants.colors.pastelBlue,
              }}
            >
              <div>{row[0]}</div>
            </td>
            <Cell label={row[0]}>{row[1]}</Cell>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
