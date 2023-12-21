import React, { PropsWithChildren } from 'react';
import constants from '#models/constants';
import { InternalError } from '#models/index';
import { logWarningInSentry } from '#utils/sentry';

interface ISectionProps {
  body: any[][];
  id?: string;
}

export const CopyPaste: React.FC<
  PropsWithChildren<{ shouldTrim?: boolean; id?: string }>
> = ({ children, shouldTrim = false, id = undefined }) => (
  <span className={`copy-button ${shouldTrim ? 'trim' : ''}`}>
    <span id={id}>{children}</span>
  </span>
);

const Cell: React.FC<PropsWithChildren<{ label?: string }>> = ({
  children,
  label = '',
}) => {
  const isCopyEnabled = typeof children === 'string' && children !== '';
  return (
    <td>
      {isCopyEnabled ? (
        <CopyPaste shouldTrim={shouldTrim(label)}>
          {children || <i>Non renseigné</i>}
        </CopyPaste>
      ) : (
        <div>
          <span>{children || <i>Non renseigné</i>}</span>
        </div>
      )}
      <style jsx>{`
        td {
          width: auto;
          padding: 5px 3px;
          background-color: #fff;
          padding-left: 30px;
        }
        @media only screen and (min-width: 1px) and (max-width: 576px) {
          td {
            padding: 0;
            margin: 0;
          }
        }
      `}</style>
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
    <table id={id}>
      <tbody>
        {body.map((row, idx) => (
          <tr key={'a' + idx}>
            <td>
              <div>{row[0]}</div>
            </td>
            <Cell label={row[0]}>{row[1]}</Cell>
          </tr>
        ))}
      </tbody>
      <style jsx>{`
        table {
          border-collapse: collapse;
          text-align: left;
          color: #081d35;
          width: 100%;
        }
        tr > td:first-of-type {
          font-weight: bold;
          padding-right: 30px;
          padding-left: 10px;
          border-right: 1px solid ${constants.colors.pastelBlue};
          vertical-align: baseline;
        }
        tr > td:first-of-type > div {
          min-width: 140px;
        }
        td,
        th {
          border: none;
          padding: 3px;
          background-color: #fff;
          padding-left: 30px;
        }
        table > thead {
          display: none;
          background-color: ${constants.colors.pastelBlue};
        }
        @media only screen and (min-width: 1px) and (max-width: 576px) {
          tr {
            display: flex;
            flex-direction: column;
            margin: 15px 0;
          }
          tr > td {
            border: none;
            padding: 0;
            margin: 0;
          }
          tr > td:first-of-type {
            border: none;
            padding: 0;
            margin: 0;
          }
        }
      `}</style>
    </table>
  );
};
