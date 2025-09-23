import NonRenseigne from '#components/non-renseigne';
import constants from '#models/constants';
import { InternalError } from '#models/exceptions';
import { logWarningInSentry } from '#utils/sentry';
import React, { JSX, PropsWithChildren } from 'react';
import { CopyPaste } from './copy-paste';
import styles from './styleSimple.module.css';

interface ISectionProps {
  body: any[][];
  id?: string;
  firstColumnWidth?: string;
}

const Cell: React.FC<PropsWithChildren<{ label?: string }>> = ({
  children,
  label = '',
}) => {
  const isCopyEnabled = typeof children === 'string' && children !== '';

  return (
    <td className={styles.cell}>
      {isCopyEnabled ? (
        <CopyPaste label={label} shouldRemoveSpace={shouldRemoveSpace(label)}>
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
const shouldRemoveSpace = (label: any) => {
  try {
    // in case label is a JSX element we use the children as label
    // as this is likely to trigger an exception we use a try / catch
    const labelAsString = label?.props?.tooltipLabel || label || '';

    if (typeof labelAsString === 'object') {
      return false;
    }

    if (
      labelAsString.indexOf('TVA') > -1 ||
      labelAsString.indexOf('EORI') > -1 ||
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
 * Convert a label to a string
 * @param label
 * @returns
 */
const labelToString = (label: string | JSX.Element): string => {
  if (typeof label === 'string') {
    return label;
  }
  if (label?.props?.tooltipLabel) {
    return label.props.tooltipLabel;
  }
  if (label?.props?.children) {
    if (typeof label?.props?.children === 'string') {
      return label?.props?.children;
    }
    if (typeof label?.props?.children?.props?.children === 'string') {
      return label?.props?.children?.props?.children;
    }
  }
  return 'unknown label';
};

/**
 * Two column tables
 * @param body two dimension array, null or undefined rows will be filtered
 * @returns
 */
export const TwoColumnTable: React.FC<ISectionProps> = ({
  id,
  body,
  firstColumnWidth,
}) => {
  return (
    <table className={styles['two-column-table']} id={id}>
      <tbody>
        {body.map((row, idx) => (
          <tr key={'a' + idx}>
            <td
              className={styles.cell}
              style={{
                borderColor: constants.colors.pastelBlue,
                /* Min width does not work in table cells https://stackoverflow.com/a/29379832 */
                width: firstColumnWidth || '30%',
              }}
            >
              <div>{row[0]}</div>
            </td>
            <Cell label={labelToString(row[0])}>{row[1]}</Cell>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
