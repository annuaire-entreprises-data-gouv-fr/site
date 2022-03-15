import React from 'react';

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
          {head.map((cell) => (
            <th key={cell}>{cell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, idx) => (
          <tr key={'row-' + idx}>
            {row.map((cell, idy) => (
              <td key={'cell-' + idy}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mobile">
      {body.map((row, idx) => (
        <div key={'row-' + idx}>
          {row.map((cell, idy) => (
            <div key={'cell-' + idy}>{cell}</div>
          ))}
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
        border: 1px solid #dfdff1;
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
        background-color: #dfdff166;
      }

      .mobile {
        display: none;
      }
      .mobile > div {
        margin: 20px 0;
      }
      .mobile > div > div:nth-of-type(1) {
        margin-bottom: 10px;
      }
      .mobile > div > div:nth-of-type(3) {
        font-style: italic;
        font-size: 0.9rem;
      }
      @media only screen and (min-width: 1px) and (max-width: 600px) {
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
