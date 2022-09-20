import React, { PropsWithChildren } from 'react';
import { JsxElement } from 'typescript';
import { copy, copied } from '../../components-ui/icon';
import { logWarningInSentry } from '../../utils/sentry';

interface ISectionProps {
  body: (any[] | undefined | null | string | boolean)[];
  id?: string;
}

export const CopyPaste: React.FC<
  PropsWithChildren<{ shouldTrim?: boolean; id?: string }>
> = ({ children, shouldTrim = false, id = undefined }) => (
  <div
    className={`copy-wrapper ${
      shouldTrim ? 'trim' : ''
    } copy-to-clipboard-anchor`}
  >
    <span id={id}>{children}</span>
    <span className="label">
      <span className="copy">{copy}&nbsp;copier</span>
      <span className="copied">{copied}&nbsp;copié!</span>
    </span>
    <style jsx>{`
      div.copy-wrapper {
        display: flex;
        align-items: center;
        justify-content: start;
        cursor: pointer;
        position: relative;
      }
      div.copy-done span.copy {
        display: none;
      }
      div.copy-done span.copied {
        display: flex;
      }
      div > span.label {
        position: relative;
        border-radius: 3px;
        padding: 0 3px;
        width: 75px;
        flex-shrink: 0;
        color: #000091;
        margin-left: 12px;
        opacity: 0;
        background-color: #dfdff1;
        font-size: 0.9rem;
      }
      div:hover > span.label {
        opacity: 1;
      }
      span.copy {
        display: flex;
        align-items: center;
      }
      span.copied {
        display: none;
        align-items: center;
        height: 100%;
        color: green;
      }
      @media only screen and (min-width: 1px) and (max-width: 991px) {
        div {
          cursor: inherit;
        }
      }
    `}</style>
  </div>
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
        <div className="default-cell">
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
        div.default-cell {
          display: flex;
          align-items: center;
          justify-content: start;
          cursor: inherit;
          position: relative;
        }
        @media only screen and (min-width: 1px) and (max-width: 600px) {
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
    const labelAsString = label?.props?.children || label || '';

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
    logWarningInSentry('Error in shouldTrim', { details: e.toString() });
    return false;
  }
};

/**
 * Two column tables
 * @param body two dimension array, null or undefined rows will be filtered
 * @returns
 */
export const TwoColumnTable: React.FC<ISectionProps> = ({ id, body }) => {
  // filter undefined and null row
  const bodyNoUndefined = body.filter((element) => {
    return (
      element !== undefined &&
      element !== null &&
      element !== false &&
      element !== ''
    );
  }) as any[][];

  return (
    <>
      <table id={id}>
        <tbody>
          {bodyNoUndefined.map((row, idx) => (
            <tr key={'a' + idx}>
              <td>{row[0]}</td>
              <Cell label={row[0]}>{row[1]}</Cell>
            </tr>
          ))}
        </tbody>
      </table>
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
          border-right: 1px solid #dfdff1;
          vertical-align: baseline;
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
          background-color: #dfdff1;
        }
        @media only screen and (min-width: 1px) and (max-width: 600px) {
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
    </>
  );
};
