import { PropsWithChildren } from 'react';

const FieldGroup: React.FC<
  PropsWithChildren<{
    label: string;
    icon: JSX.Element;
    defaultValue?: boolean;
  }>
> = ({ children, label, icon, defaultValue = false }) => {
  // css selector work best starting with a string
  return (
    <details open={defaultValue}>
      <summary>
        {icon}&nbsp;{label}
      </summary>
      <div>{children}</div>
      <style jsx>
        {`
          summary {
            padding: 10px;
            margin: 0;
            border-bottom: 1px solid #eee;
            list-style: none;
            position: relative;
            user-select: none;
            display: flex;
            align-items: center;
          }
          summary:hover {
            background: #f6f6f6;
          }

          details summary::after {
            content: '+';
            color: #000091;
            font-weight: bold;
            font-size: 1.2rem;
            position: absolute;
            right: 10px;
            top: 10px;
          }

          details[open] summary::after {
            content: '⎼';
          }
          summary:marker {
            display: none;
          }

          details {
            font-size: 0.9rem;
          }
          details > div {
            padding: 10px;
            padding-right: 0;
            font-size: 0.9rem;
          }
        `}
      </style>
    </details>
  );
};

export default FieldGroup;
