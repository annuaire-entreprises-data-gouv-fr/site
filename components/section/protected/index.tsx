import { PropsWithChildren } from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';
import { ISectionProps, Section } from '..';
import styles from './styles.module.css';

export const ProtectedSection: React.FC<PropsWithChildren<ISectionProps>> = ({
  title,
  children,
  sources,
}) => (
  <Section
    title={title}
    borderColor={constants.colors.espaceAgentPastel}
    titleColor={constants.colors.espaceAgent}
    sources={sources}
  >
    <div className={styles.protected}>
      <Icon size={12} slug="lockFill">
        Réservé aux agents publics
      </Icon>
    </div>
    {children}
  </Section>
);
