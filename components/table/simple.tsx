import React, { PropsWithChildren } from 'react';

interface ISectionProps {
  body: any[][];
  id?: string;
}

export const CopyCell: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <td>
    <div>
      <span>{children}</span>
      <span>
        <span className="copy">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
          copier
        </span>
        <span className="copied">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      </span>
      <script
        dangerouslySetInnerHTML={{
          __html: `
                function copyToClipBoard(el) {
                    console.log(el)
                }
              `,
        }}
      />
    </div>
    <style jsx>{`
      td {
        width: auto;
        padding: 5px;
        background-color: #fff;
        padding-left: 30px;
      }
      div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
      }
      div > span:last-of-type {
        border-radius: 4px;
        padding: 0 4px;
        border: 2px solid transparent;
        color: #000091;
        margin-left: 20px;
        opacity: 0;
        background-color: #dfdff1;
      }
      div:hover > span:last-of-type {
        opacity: 1;
      }
      span.copy {
        display: flex;
        align-items: center;
      }
      span.copied {
        display: none;
      }
    `}</style>
  </td>
);

export const SimpleTable: React.FC<ISectionProps> = ({ id, body }) => (
  <>
    <table id={id}>
      <tbody>
        {body.map((row, idx) => (
          <tr key={idx}>
            {row.map((cell, idx) => (
              <React.Fragment key={cell}>
                {idx === 0 ? <td>{cell}</td> : <CopyCell>{cell}</CopyCell>}
              </React.Fragment>
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
