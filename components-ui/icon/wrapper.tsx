import { PropsWithChildren } from 'react';
import { IIconsSlug, icons } from '.';

type IProps = {
  id?: string;
  className?: string;
  size?: number;
  color?: string;
  slug: IIconsSlug;
};

export const Icon: React.FC<PropsWithChildren<IProps>> = ({
  id,
  className = '',
  size = 18,
  color,
  children,
  slug,
}) => {
  const icon = icons[slug];
  if (!icon) {
    console.error(`Error in <Icon/> : ${slug} icon does not exists`);
  }
  return (
    <div id={id} className={`icon-wrapper ${className}`}>
      <span className="icon">{icon}</span>
      <span>{children}</span>
      <style jsx>{`
        .icon-wrapper {
          padding: 0;
          display: inline-flex;
          align-items: center;
          flex-direction: row;
          flex-wrap: nowrap;
        }
        .icon {
          height: ${size}px;
          width: ${size}px;
          color: ${color || 'inherit'};
          padding: 0;
          margin-right: ${children ? '5px' : ''};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};
