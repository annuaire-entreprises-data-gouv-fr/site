import { PropsWithChildren } from 'react';

const PrintOnly: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div>
    {children}
    <style jsx>
      {`
        div {
          display: none;
        }
        @media print {
          div {
            display: block;
          }
        }
      `}
    </style>
  </div>
);

const PrintNever: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div>
    {children}
    <style jsx>
      {`
        div {
          display: block;
        }
        @media print {
          div {
            display: none;
          }
        }
      `}
    </style>
  </div>
);

export { PrintNever, PrintOnly };
