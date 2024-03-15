import { PropsWithChildren } from 'react';
import { IIconsSlug, icons } from '.';
import styles from './styles.module.css';

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
    <div id={id} className={styles.icon + ' ' + className}>
      <span
        style={{
          height: size + 'px',
          width: size + 'px',
          color: color || 'inherit',
          marginRight: children ? '5px' : '0',
        }}
      >
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
};
