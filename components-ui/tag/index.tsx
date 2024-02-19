import React, { PropsWithChildren } from 'react';
import styles from './styles.module.css';

interface ITagProps {
  size?: 'medium' | 'small';
  id?: string;
  color?: 'default' | 'error' | 'info' | 'new' | 'success' | 'warning';
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
  maxWidth,
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
          maxWidth: maxWidth || '80vw',
        }}
        className={
          styles['.fr-badge'] +
          ` fr-badge fr-badge--no-icon ${badgeSize[size]} ${badgeColor[color]} dsfr-overwrite`
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
};
