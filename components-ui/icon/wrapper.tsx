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
    <div
      id={id}
      className={className}
      style={{
        padding: '0',
        display: 'inline-flex',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
      }}
    >
      <span
        style={{
          height: size + 'px',
          width: size + 'px',
          color: color || 'inherit',
          padding: '0',
          marginRight: children ? '5px' : '',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: '0',
        }}
      >
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
};
