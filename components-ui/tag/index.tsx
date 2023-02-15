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

  return (
    <>
      &nbsp;
      <span
        className={`fr-badge fr-badge--no-icon ${badgeSize[size]} ${
          color ? `fr-badge--${color}` : ''
        }`}
      >
        {children}
      </span>
      &nbsp;
      <style jsx>{`
        .fr-badge {
          display: inline;
        }
      `}</style>
    </>
  );
};
