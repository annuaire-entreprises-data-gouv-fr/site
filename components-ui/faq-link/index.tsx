import React, { PropsWithChildren } from 'react';
import { information } from '../icon';

const FAQLink: React.FC<PropsWithChildren<{ to: string }>> = ({
  to,
  children,
}) => (
  <>
    <a className="faq-link" href={`/faq/${to}`}>
      {children} <span>{information}</span>
    </a>
    <style jsx>{`
      a.faq-link {
        margin: 0;
        padding: 0;
        box-shadow: none;
        border-bottom: 1px dotted #666;
      }
      a.faq-link > span {
        color: #000091;
      }
    `}</style>
  </>
);

export default FAQLink;
