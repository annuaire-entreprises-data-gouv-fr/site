import React, { PropsWithChildren } from 'react';
import { IIconsSlug } from '#components-ui/icon';
import { Icon } from '#components-ui/icon/wrapper';

const colors = {
  info: ['#0078f3', '#f4f6ff'],
  success: ['#18753c', '#dffee6'],
  error: ['#ce0500', '#fff4f4'],
  warning: ['#ff9c00', '#fff3e0'],
};

const Alert: React.FC<
  PropsWithChildren<{
    full?: boolean;
    color1: string;
    color2: string;
    icon: IIconsSlug;
  }>
> = ({ full = false, color1, color2, icon, children }) => (
  <div className="alert">
    <div>
      <Icon color={color1} size={16} slug={icon} />
    </div>
    <div>{children}</div>
    <style jsx>{`
      .alert {
        border: none;
        border-radius: 2px;
        border-left: 4px solid ${color1};
        background-color: ${color2};
        padding: 10px;
        margin: 10px 0;
        display: flex;
        align-items: start;
        width: ${full ? '100%' : 'auto'};
      }
      .alert > div:first-of-type {
        margin-right: 10px;
      }
    `}</style>
  </div>
);

export const Success: React.FC<PropsWithChildren<{ full?: boolean }>> = ({
  full,
  children,
}) => (
  <Alert
    full={full}
    color1={colors.success[0]}
    color2={colors.success[1]}
    icon="successFill"
  >
    {children}
  </Alert>
);

export const Warning: React.FC<PropsWithChildren<{ full?: boolean }>> = ({
  full,
  children,
}) => (
  <Alert
    full={full}
    color1={colors.warning[0]}
    color2={colors.warning[1]}
    icon="alertFill"
  >
    {children}
  </Alert>
);

export const Error: React.FC<PropsWithChildren<{ full?: boolean }>> = ({
  full,
  children,
}) => (
  <Alert
    full={full}
    color1={colors.error[0]}
    color2={colors.error[1]}
    icon="errorFill"
  >
    {children}
  </Alert>
);

export const Info: React.FC<PropsWithChildren<{ full?: boolean }>> = ({
  full,
  children,
}) => (
  <Alert
    full={full}
    color1={colors.info[0]}
    color2={colors.info[1]}
    icon="information"
  >
    {children}
  </Alert>
);
