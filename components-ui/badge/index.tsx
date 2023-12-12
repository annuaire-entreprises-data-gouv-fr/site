import { MouseEventHandler, PropsWithChildren } from 'react';
import { IIconsSlug } from '#components-ui/icon';
import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';

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
      className={`badge-wrapper ${isSelected ? 'active' : ''} `}
    >
      <span className="badge-icon" aria-hidden>
        <Icon size={16} slug={icon} />
      </span>
      <span className="badge-label">{label}</span>
      <style jsx>{`
        .badge-wrapper {
          display: inline-flex;
          align-items: stretch;
          justify-content: center;
          font-size: ${small ? '0.9rem' : '1rem'};
          margin: 2px 0;
          margin-right: 0.25rem;
          border: 2px solid transparent;
          border-radius: 50px;
          padding: 0;
          line-height: inherit;
          cursor: ${onClick ? 'pointer' : 'inherit'};
        }
        .badge-wrapper:hover {
          border: 2px dashed
            ${onClick && !link ? constants.colors.frBlue : 'transparent'};
        }
        .badge-wrapper.active {
          border: 2px solid ${constants.colors.frBlue};
        }

        a.badge-wrapper {
          background: none;
        }
        a.badge-wrapper .badge-label {
          text-decoration: underline;
        }
        a.badge-wrapper:hover {
          filter: brightness(0.95);
        }
        a.badge-wrapper:active {
          filter: brightness(0.9);
        }

        .badge-icon {
          border-top-left-radius: 50px;
          border-bottom-left-radius: 50px;
          background-color: ${backgroundColor};
          color: ${fontColor};
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: ${small ? '0 6px' : '2px 8px'};
        }

        .badge-label {
          border-top-right-radius: 50px;
          border-bottom-right-radius: 50px;
          background-color: #eee;
          color: #555;
          font-weight: bold;
          padding: ${small ? '0 8px 0 6px' : '2px 10px 2px 8px'};
        }
      `}</style>
    </ContainerComponent>
  );
}
