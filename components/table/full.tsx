import React from 'react';

interface ISectionProps {
  head: string[];
  body: any[][];
  id?: string;
}

export const FullTable: React.FC<ISectionProps> = ({ id, head, body }) => (
  <>
    <table id={id}>
      <thead>
        <tr>
          {head.map((cell) => (
            <th key={cell}>{cell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, idx) => (
          <tr key={idx}>
            {row.map((cell, idx) => (
              <td key={idx}>{cell}</td>
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
        width:100%;:
      }
      table tr:hover > td {
        background-color: #dfdff166;
      }
    `}</style>
  </>
);
