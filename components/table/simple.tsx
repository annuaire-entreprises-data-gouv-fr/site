import React from 'react';

interface ISectionProps {
  body: any[][];
  id?: string;
}

export const SimpleTable: React.FC<ISectionProps> = ({ id, body }) => (
  <>
    <table id={id}>
      <tbody>
        {body.map((row) => (
          <tr>
            {row.map((cell) => (
              <td>{cell}</td>
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
      tr > td:first-of-type {
        font-weight: bold;
        padding-right: 30px;
        padding-left: 10px;
        border-right: 1px solid #dfdff1;
      }
      td,
      th {
        border: 1px solid #dfdff1;
        border-left: none;
        border-right: none;
        border: none;
        padding: 5px;
        background-color: #fff;
        padding-left: 30px;
      }
      table > thead {
        display: none;
        background-color: #dfdff1;
      }
    `}</style>
  </>
);
