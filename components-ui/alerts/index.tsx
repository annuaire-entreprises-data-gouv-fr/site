import React, { PropsWithChildren } from 'react';
import { IIconsSlug } from '#components-ui/icon';
import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';
import styles from './styles.module.css';

const colors = {
  info: ['#0078f3', '#e5f3ff'],
  success: ['#18753c', '#dffee6'],
  error: ['#ce0500', '#fff4f4'],
  warning: ['#ff9c00', '#fff3e0'],
  protected: [constants.colors.espaceAgent, constants.colors.espaceAgentPastel],
};

const Alert: React.FC<
  PropsWithChildren<{
    full?: boolean;
    color1: string;
    color2: string;
    icon: IIconsSlug;
  }>
> = ({ full = false, color1, color2, icon, children }) => (
  <div
    className={styles.alert}
    style={{
      borderLeft: `4px solid ${color1}`,
      backgroundColor: color2,
      width: full ? '100%' : 'auto',
    }}
  >
    <div>
      <Icon color={color1} size={16} slug={icon} />
    </div>
    <div>{children}</div>
  </div>
);

export const ProtectedData: React.FC<PropsWithChildren<{ full?: boolean }>> = ({
  full = false,
  children,
}) => (
  <Alert
    full={full}
    color1={colors.protected[0]}
    color2={colors.protected[1]}
    icon="lockFill"
  >
    {children}
  </Alert>
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
