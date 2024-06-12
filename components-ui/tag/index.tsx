import React, { PropsWithChildren } from 'react';
import styles from './styles.module.css';

interface ITagProps {
  size?: 'medium' | 'small';
  id?: string;
  color?:
    | 'default'
    | 'error'
    | 'info'
    | 'new'
    | 'success'
    | 'warning'
    | 'agent';
  // title?: string;
  link?: {
    href: string;
    'aria-label': string;
  };
  maxWidth?: string;
}

export const Tag: React.FC<PropsWithChildren<ITagProps>> = ({
  children,
  id,
  size = 'medium',
  color = 'default',
  link,
}) => {
  const ContainerComponent = (
    props: PropsWithChildren<{ style?: any; className?: string; id?: string }>
  ) =>
    link ? (
      <a href={link.href} aria-label={link['aria-label']} {...props} />
    ) : (
      <span {...props} />
    );

  return (
    <>
      <ContainerComponent
        id={id}
        style={{
          margin: '3px',
        }}
        className={
          styles.frBadge +
          ` fr-badge fr-badge--no-icon ${badgeSize[size]} ${badgeColor[color]}`
        }
      >
        {children}
      </ContainerComponent>
    </>
  );
};

const badgeSize = {
  small: 'fr-badge--sm',
  medium: 'fr-badge--md',
};

const badgeColor = {
  default: '',
  new: 'fr-badge--new',
  error: 'fr-badge--error',
  warning: 'fr-badge--warning',
  info: 'fr-badge--info',
  success: 'fr-badge--success',
  agent: 'fr-badge--purple-glycine',
};
