'use client';

import React, { PropsWithChildren } from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
import constants from '#models/constants';

const FAQLink: React.FC<
  PropsWithChildren<{ tooltipLabel: string; to?: string }>
> = ({ to, tooltipLabel, children }) => (
  <>
    <InformationTooltip
      label={to ? <a href={to}>{children}</a> : children}
      orientation="left"
      width={230}
      left="5px"
    >
      <span className="faq-label">
        {tooltipLabel}{' '}
        <Icon color={constants.colors.frBlue} size={12} slug="information" />
      </span>
    </InformationTooltip>

    <style jsx>{`
      span.faq-label {
        margin: 0;
        padding: 0;
        border-bottom: 1px dotted #666;
      }
    `}</style>
  </>
);

export default FAQLink;
