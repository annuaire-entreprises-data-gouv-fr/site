import React, { PropsWithChildren } from 'react';
import { information } from '../icon';
import InformationTooltip from '../information-tooltip';

const FAQLink: React.FC<PropsWithChildren<{ tooltipLabel: string }>> = ({
  tooltipLabel,
  children,
}) => (
  <>
    <InformationTooltip
      label={children}
      orientation="left"
      width={230}
      left="5px"
    >
      <span className="faq-label">
        {tooltipLabel} <span>{information}</span>
      </span>
    </InformationTooltip>

    <style jsx>{`
      span.faq-label {
        margin: 0;
        padding: 0;
        border-bottom: 1px dotted #666;
      }
      span.faq-label > span {
        color: #000091;
      }
    `}</style>
  </>
);

export default FAQLink;
