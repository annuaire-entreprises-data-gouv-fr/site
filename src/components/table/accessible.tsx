import type { ReactNode } from "react";

export function AccessibleTable({
  head,
  body,
  caption,
}: {
  head: ReactNode[];
  body: ReactNode[][];
  caption?: string;
}) {
  return (
    <div className="fr-table">
      <table>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {head.map((cell, index) => (
              <th key={index} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, index) => (
            <tr key={index}>
              <th scope="row">{row[0]}</th>
              {row.slice(1).map((cell, cellIndex) => (
                <td key={cellIndex}>{cell ?? "Non renseigné"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
