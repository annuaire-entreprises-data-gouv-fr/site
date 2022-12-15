import { PropsWithChildren } from 'react';
import { closed, open } from '../icon';

export const VerifiedTag: React.FC<
  PropsWithChildren<{ isVerified?: boolean }>
> = ({ children, isVerified = true }) => (
  <span className="verified-tag-wrapper">
    {isVerified ? open : closed}&nbsp;{children}
    <style jsx>{`
      .verified-tag-wrapper {
        flex-shrink: 0;
        display: inline-flex;
        background-color: #eee;
        align-items: center;
        justify-content: center;
        color: #555;
        border-radius: 50px;
        font-weight: bold;
        padding: 2px 8px;
        margin: 2px 0;
      }
    `}</style>
  </span>
);
