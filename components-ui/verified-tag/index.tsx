import { PropsWithChildren } from 'react';
import { Badge } from '#components-ui/tag/badge';
import { closed, open } from '../icon';

export const VerifiedTag: React.FC<
  PropsWithChildren<{ isVerified?: boolean }>
> = ({ children, isVerified = true }) => (
  <div className="layout-left">
    <Badge
      icon={isVerified ? open : closed}
      label={children}
      backgroundColor="#eee"
      fontColor="#555"
    />
  </div>
);
