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
      className={
        styles.badgeWrapper +
        ` ${isSelected ? 'active' : ''} ${!!onClick ? 'cursor-pointer' : ''} ${
          small ? 'small' : ''
        }${onClick && !link ? 'on-click-no-link' : ''}`
      }
    >
      <span
        className={styles.badgeIcon}
        aria-hidden
        style={{ backgroundColor: backgroundColor, color: fontColor }}
      >
        <Icon size={16} slug={icon} />
      </span>
      <span className={styles.badgeLabel}>{label}</span>
    </ContainerComponent>
  );
}
