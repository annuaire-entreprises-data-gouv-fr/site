import React, { PropsWithChildren } from 'react';
import { copy, copied } from '../../components-ui/icon';

interface ISectionProps {
  body: any[][];
  id?: string;
}

export const CopyCell: React.FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className = '',
}) => {
  const isCopyEnabled = typeof children === 'string';
  return (
    <td>
      <div
        className={`copy-wrapper ${className} ${
          isCopyEnabled ? 'copy-to-clipboard-anchor' : ''
        }`}
      >
        <span>{children || <i>Non renseigné</i>}</span>
        {isCopyEnabled && (
          <span className="label">
            <span className="copy">{copy}&nbsp;copier</span>
            <span className="copied">{copied}&nbsp;copié!</span>
          </span>
        )}
      </div>
      <style jsx>{`
        td {
          width: auto;
          padding: 3px;
          background-color: #fff;
          padding-left: 30px;
        }
        div.copy-wrapper {
          display: flex;
          align-items: center;
          justify-content: start;
          cursor: ${isCopyEnabled ? 'pointer' : 'inherit'};
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
          height: 28px;
          width: 75px;
          flex-shrink: 0;
          border: 2px solid transparent;
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
        @media only screen and (min-width: 1px) and (max-width: 900px) {
          div {
            cursor: inherit;
          }
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
const getClass = (label: string) => {
  if (
    label.indexOf('TVA') > -1 ||
    label.indexOf('SIREN') > -1 ||
    label.indexOf('SIRET') > -1 ||
    label.indexOf('RNA') > -1
  ) {
    return 'trim';
  }
};

export const TwoColumnTable: React.FC<ISectionProps> = ({ id, body }) => (
  <>
    <table id={id}>
      <tbody>
        {body.map((row, idx) => (
          <tr key={'a' + idx}>
            <td>{row[0]}</td>
            <CopyCell className={getClass(row[0])}>{row[1]}</CopyCell>
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
