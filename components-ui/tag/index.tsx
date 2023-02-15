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
    success: 'fr-badge--success',
    error: 'fr-badge--error',
    info: 'fr-badge--info',
    warning: 'fr-badge--warning',
    new: 'fr-badge--new',
  };

  return (
    <p
      className={`fr-badge fr-badge--no-icon ${badgeSize[size]} ${badgeColor[color]}`}
    >
      {children}
    </p>
  );
};
