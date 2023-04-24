import React from 'react';
import constants from '#models/constants';

interface ISectionProps {
  head: string[];
  body: any[][];
  id?: string;
}

export const FullTable: React.FC<ISectionProps> = ({ id, head, body }) => (
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
              <td key={'cell-' + rowIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mobile">
      {body.map((row, bodyIndex) => (
        <div key={'row-' + bodyIndex}>
          {row.map((cell, rowIndex) =>
            !cell && cell !== 0 ? null : (
              <div key={rowIndex}>
                <b>{head[rowIndex]}&nbsp;:</b> {cell}
              </div>
            )
          )}
        </div>
      ))}
    </div>
    <style jsx>{`
      table {
        border-collapse: collapse;
        text-align: left;
        color: #081d35;
      }

      tr td,
      th {
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

      .mobile {
        display: none;
      }
      .mobile > div {
        margin: 20px 0;
      }

      @media only screen and (min-width: 1px) and (max-width: 992px) {
        .mobile {
          display: block;
        }
        table {
          display: none;
        }
      }
    `}</style>
  </>
);
