import { PropsWithChildren } from 'react';
import {
  administrationFill,
  awardFill,
  building,
  buildingFill,
  closed,
  collectiviteFill,
  communityFill,
  file,
  humanPin,
  information,
  lockFill,
  mapPin,
  open,
  user,
} from '.';

interface IProps {
  size?: number;
  color?: string;
  slug: string;
}

const icons = {
  lockFill: lockFill,
  user: user,
  communityFill: communityFill,
  collectiviteFill: collectiviteFill,
  awardFill: awardFill,
  administrationFill: administrationFill,
  buildingFill: buildingFill,
  open: open,
  closed: closed,
  humanPin: humanPin,
  file: file,
  building: building,
  mapPin: mapPin,
  information: information,
};

export const Icon: React.FC<PropsWithChildren<IProps>> = ({
  size = 18,
  color,
  children,
  slug,
}) => (
  <div className="icon-wrapper">
    <span className="icon">{icons[slug]}</span>
    {children}
    <style jsx>{`
      .icon-wrapper {
        padding: 0;
        display: inline-flex;
        align-items: center;
        flex-direction: row;
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
      }
    `}</style>
  </div>
);
