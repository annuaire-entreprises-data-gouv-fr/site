import { MouseEventHandler, PropsWithChildren } from 'react';
import { IIconsSlug } from '#components-ui/icon';
import { Icon } from '#components-ui/icon/wrapper';
import styles from './styles.module.css';

interface IProps extends IPartialBadgeProps {
  icon: IIconsSlug;
  backgroundColor?: string;
  fontColor?: string;
}

export interface IPartialBadgeProps {
  label?: string;
  small?: boolean;
  isSelected?: boolean;
  onClick?: MouseEventHandler;
  link?: {
    href: string;
    'aria-label': string;
  };
}

export function Badge({
  icon,
  label,
  small = false,
  isSelected = false,
  backgroundColor,
  fontColor,
  onClick,
  link,
}: IProps) {
  const ContainerComponent = (
    props: PropsWithChildren<{
      className?: string;
      style?: { [key: string]: string };
      onClick?: MouseEventHandler;
    }>
  ) =>
    link ? (
      <a href={link.href} aria-label={link['aria-label']} {...props} />
    ) : (
      <span {...props} />
    );

  return (
    <ContainerComponent
      onClick={onClick}
      className={`${styles.badgeWrapper} ${
        onClick && !link && !isSelected ? styles.badgeWrapperOnClick : ''
      } ${!!onClick ? ' cursor-pointer' : ''}`}
      style={{
        border: isSelected ? '2px solid #000091' : '2px solid transparent',
        fontSize: small ? '0.9rem' : '1rem',
      }}
    >
      <span
        className={styles.badgeIcon}
        aria-hidden
        style={{
          backgroundColor: backgroundColor,
          color: fontColor,
          padding: small ? '0 6px' : '2px 8px',
        }}
      >
        <Icon size={16} slug={icon} />
      </span>
      <span
        className={styles.badgeLabel}
        style={{
          padding: small ? '0 8px 0 6px' : '2px 10px 2px 8px',
        }}
      >
        {label}
      </span>
    </ContainerComponent>
  );
}
