import React from 'react';
import styles from './styleFull.module.css';

interface ISectionProps {
  head: (string | React.JSX.Element)[];
  body: any[][];
  id?: string;
  verticalAlign?: 'top' | 'middle' | 'bottom';
  columnWidths?: string[];
}

export const FullTable: React.FC<ISectionProps> = ({
  id,
  head,
  body,
  verticalAlign = 'middle',
  columnWidths,
}) => (
  <>
    <table id={id} className={styles.fullTable}>
      <thead className={styles.head}>
        <tr>
          {head.map((cell, index) => (
            <th
              key={index}
              style={
                columnWidths?.[index]
                  ? { width: columnWidths[index] }
                  : undefined
              }
            >
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, bodyIndex) => (
          <tr key={'row-' + bodyIndex} className={styles.row}>
            {row.map((cell, rowIndex) => (
              <td
                key={'cell-' + rowIndex}
                style={{
                  verticalAlign,
                  ...(columnWidths?.[rowIndex]
                    ? { width: columnWidths[rowIndex] }
                    : {}),
                }}
                className={styles.cell}
              >
                {cell == null || cell === '' ? null : (
                  <strong aria-hidden className={styles.mobile}>
                    {head[rowIndex]}&nbsp;:&nbsp;
                  </strong>
                )}
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </>
);
