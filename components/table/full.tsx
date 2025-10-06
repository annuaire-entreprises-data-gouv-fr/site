import type React from "react";
import styles from "./styleFull.module.css";

interface ISectionProps {
  head: (string | React.JSX.Element)[];
  body: any[][];
  id?: string;
  verticalAlign?: "top" | "middle" | "bottom";
  columnWidths?: string[];
}

export const FullTable: React.FC<ISectionProps> = ({
  id,
  head,
  body,
  verticalAlign = "middle",
  columnWidths,
}) => (
  <>
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
          <tr className={styles.row} key={"row-" + bodyIndex}>
            {row.map((cell, rowIndex) => (
              <td
                className={styles.cell}
                key={"cell-" + rowIndex}
                style={{
                  verticalAlign,
                  ...(columnWidths?.[rowIndex]
                    ? { width: columnWidths[rowIndex] }
                    : {}),
                }}
              >
                {cell == null || cell === "" ? null : (
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
