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

  let serializedTag = '';
  try {
    serializedTag = children?.toString() || '';
  } catch {}

  return (
    <>
      <span
        className={`fr-badge fr-badge--no-icon ${badgeSize[size]} ${badgeColor[color]}`}
        title={serializedTag}
      >
        {children}
      </span>
      <style jsx>{`
        .fr-badge {
          white-space: nowrap;
          display: inline-block;
          vertical-align: middle;
          margin: 3px 5px;
          max-width: 80vw;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </>
  );
};
