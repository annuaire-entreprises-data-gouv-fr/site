import React, { PropsWithChildren } from 'react';
import { information } from '../icon';
import InformationTooltip from '../information-tooltip';

const FAQLink: React.FC<
  PropsWithChildren<{ to: string; tooltipLabel?: string }>
> = ({ to, tooltipLabel, children }) => (
  <>
    {tooltipLabel ? (
      <InformationTooltip
        label={
          <a href={`/faq/${to}`} style={{ fontWeight: 'normal' }}>
            {tooltipLabel}
          </a>
        }
        orientation="left"
        width={230}
        left="5px"
      >
        <a className="faq-link no-style-link" href={`/faq/${to}`}>
          {children} <span>{information}</span>
        </a>
      </InformationTooltip>
    ) : (
      <a className="faq-link no-style-link" href={`/faq/${to}`}>
        {children} <span>{information}</span>
      </a>
    )}
    <style jsx>{`
      a.faq-link {
        margin: 0;
        padding: 0;
        border-bottom: 1px dotted #666;
      }
      a.faq-link > span {
        color: #000091;
      }
    `}</style>
  </>
);

export default FAQLink;
