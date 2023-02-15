import React, { PropsWithChildren } from 'react';

interface ITagProps {
  size?: 'medium' | 'small';
  color?: 'default' | 'error' | 'info' | 'new' | 'success' | 'warning';
}

export const Tag: React.FC<PropsWithChildren<ITagProps>> = ({
  children,
  size = 'medium',
  color = 'default',
}) => {
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

  return (
    <>
      <span
        className={`fr-badge fr-badge--no-icon ${badgeSize[size]} ${badgeColor[color]}`}
      >
        {children}
      </span>
      <style jsx>{`
        .fr-badge {
          display: inline;
          white-space: nowrap;
          margin: 0 5px;
        }
      `}</style>
    </>
  );
};
