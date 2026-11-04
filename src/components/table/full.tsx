import type React from "react";
import styles from "./styleFull.module.css";

interface ISectionProps {
  body: any[][];
  columnWidths?: string[];
  head: (string | React.JSX.Element)[];
  id?: string;
  // small screens hide the head and repeat it in front of each cell: labels to
  // repeat instead of the head
  mobileHead?: (string | React.JSX.Element)[];
  // small screens: shown once above the rows, in place of the hidden head
  mobileTitle?: React.ReactNode;
  verticalAlign?: "top" | "middle" | "bottom";
}

export const FullTable: React.FC<ISectionProps> = ({
  id,
  head,
  body,
  verticalAlign = "middle",
  columnWidths,
  mobileHead = head,
  mobileTitle,
}) => (
  <>
    {mobileTitle && <p className={styles.mobileTitle}>{mobileTitle}</p>}
    <table className={styles.fullTable} id={id}>
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
          <tr className={styles.row} key={`row-${bodyIndex}`}>
            {row.map((cell, rowIndex) => (
              <td
                className={styles.cell}
                key={`cell-${rowIndex}`}
                // column widths are set on the head only: on small screens,
                // cells are stacked and must take the full width
                style={{ verticalAlign }}
              >
                {cell == null || cell === "" ? null : (
                  <strong aria-hidden className={styles.mobile}>
                    {mobileHead[rowIndex]}&nbsp;:&nbsp;
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
