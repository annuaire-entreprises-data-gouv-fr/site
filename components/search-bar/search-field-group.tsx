import { PropsWithChildren } from 'react';
import randomId from '../../utils/helpers/randomId';

const FieldGroup: React.FC<PropsWithChildren<{ label: string }>> = ({
  children,
  label,
}) => {
  // css selector work best starting with a string
  return (
    <details>
      <summary>Filtrer par {label}</summary>
      <div>{children}</div>
    </details>
  );
};

export default FieldGroup;
