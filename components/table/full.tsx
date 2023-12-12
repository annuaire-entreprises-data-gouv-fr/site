import React from 'react';
import constants from '#models/constants';

interface ISectionProps {
  head: string[];
  body: any[][];
  id?: string;
  verticalAlign?: 'top' | 'middle' | 'bottom';
}

export const FullTable: React.FC<ISectionProps> = ({
  id,
  head,
  body,
  verticalAlign = 'middle',
}) => (
  <>
    <table id={id} className="full-table">
      <thead>
        <tr>
          {head.map((cell, index) => (
            <th key={index}>{cell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, bodyIndex) => (
          <tr key={'row-' + bodyIndex}>
            {row.map((cell, rowIndex) => (
              <td key={'cell-' + rowIndex}>
                <strong aria-hidden className="mobile">
                  {head[rowIndex]}&nbsp;:&nbsp;
                </strong>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

    <style jsx>{`
      table {
        border-collapse: collapse;
        text-align: left;
        color: #081d35;
      }

      tr td,
      th {
        vertical-align: ${verticalAlign};
        border: 1px solid ${constants.colors.pastelBlue};
        border-left: none;
        border-right: none;
        border: none;
        padding: 5px;
        background-color: #fff;
      }

      tr > td,
      table th {
        padding-left: 10px;
      }

      table {
        width: 100%;
      }

      table tr:hover > td {
        background-color: ${constants.colors.pastelBlue}66;
      }

      @media only screen and (min-width: 1px) and (max-width: 992px) {
        table,
        tbody,
        tr,
        td {
          display: block;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        thead {
          display: none;
        }
        table tr:hover > td {
          background-color: transparent;
        }
      }

      @media (min-width: 993px) {
        .mobile {
          display: none;
        }
      }
    `}</style>
  </>
);
