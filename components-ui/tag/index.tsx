import React, { PropsWithChildren } from 'react';

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
    props: PropsWithChildren<{ className?: string; id?: string }>
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
        className={`fr-badge fr-badge--no-icon ${badgeSize[size]} ${badgeColor[color]}`}
      >
        {children}
      </ContainerComponent>
      <style jsx>{`
        .fr-badge {
          white-space: nowrap;
          display: inline-block;
          vertical-align: middle;
          margin: 3px 5px;
          max-width: ${maxWidth || '80vw'};
          overflow: hidden;
          text-overflow: ellipsis;
        }
        a.fr-badge {
          text-decoration: underline;
          border: none;
        }
        a.fr-badge:hover {
          filter: brightness(0.95);
        }
        a.fr-badge:active {
          filter: brightness(0.9);
        }
      `}</style>
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
