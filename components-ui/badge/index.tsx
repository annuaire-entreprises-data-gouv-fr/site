import { MouseEventHandler } from 'react';

interface IProps extends IPartialBadgeProps {
  icon: JSX.Element;
  backgroundColor?: string;
  fontColor?: string;
}

export interface IPartialBadgeProps {
  label?: string;
  small?: boolean;
  isSelected?: boolean;
  onClick?: MouseEventHandler;
}

export const Badge: React.FC<IProps> = ({
  icon,
  label,
  small = false,
  isSelected = false,
  backgroundColor,
  fontColor,
  onClick,
}) => (
  <span
    className={`badge-wrapper ${isSelected ? 'active' : ''}`}
    onClick={onClick ? onClick : () => {}}
  >
    <span className="badge-icon">{icon}</span>
    <span className="badge-label">{label}</span>
    <style jsx>{`
      .badge-wrapper {
        display: inline-flex;
        align-items: stretch;
        justify-content: center;
        font-size: ${small ? '0.9rem' : '1rem'};
        margin: 2px 0;
        border: 2px solid transparent;
        border-radius: 50px;
        cursor: ${onClick ? 'pointer' : 'inherit'};
      }

      .badge-wrapper:hover {
        border: 2px dashed ${onClick ? '#000091' : 'transparent'};
      }
      .badge-wrapper.active {
        border: 2px solid #000091;
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
  </span>
);
