import React, { PropsWithChildren } from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
import constants from '#models/constants';

const FAQLink: React.FC<
  PropsWithChildren<{ tooltipLabel: string; to?: string }>
> = ({ to, tooltipLabel, children }) => (
  <InformationTooltip
    label={children}
    tabIndex={to ? undefined : 0}
    orientation="left"
    width={230}
    left="0px"
    ariaRelation="describedby"
  >
    <LinkOrSpan to={to} ariaLabel={`En savoir plus sur ${tooltipLabel}`}>
      <span
        style={{
          margin: 0,
          padding: 0,
          borderBottom: '1px dotted #666',
        }}
      >
        {tooltipLabel}{' '}
        <Icon color={constants.colors.frBlue} size={12} slug="information" />
      </span>
    </LinkOrSpan>
  </InformationTooltip>
);

const LinkOrSpan: React.FC<
  PropsWithChildren<{ to?: string; ariaLabel: string }>
> = ({ to, children, ariaLabel }) =>
  to ? (
    <a href={to} aria-label={ariaLabel} className="no-style-link">
      {children}
    </a>
  ) : (
    <span>{children}</span>
  );

export default FAQLink;
