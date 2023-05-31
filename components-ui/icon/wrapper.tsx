import { PropsWithChildren } from 'react';
import { icons } from '.';
import styles from './styles.module.scss';

type IProps = {
  id?: string;
  className?: string;
  size?: number;
  color?: string;
  slug: string;
};

export const Icon: React.FC<PropsWithChildren<IProps>> = ({
  id,
  className = '',
  size = 18,
  color,
  children,
  slug,
}) => {
  //@ts-ignore
  const icon = icons[slug];
  if (!icon) {
    console.error(`Error in <Icon/> : ${slug} icon does not exists`);
  }
  return (
    <div id={id} className={`${styles['icon-wrapper']} ${className}`}>
      <span
        className={styles.icon}
        style={{
          height: size,
          width: size,
          color: color || 'inherit',
          marginRight: children ? '5px' : '',
        }}
      >
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
};
