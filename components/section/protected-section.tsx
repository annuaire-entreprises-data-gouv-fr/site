import { PropsWithChildren } from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';
import { ISectionProps, Section } from '.';

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
    <div className="protected-data">
      <Icon size={12} slug="lockFill">
        Réservé aux agents publics
      </Icon>
    </div>
    {children}
    <style jsx>{`
      .protected-data {
        position: absolute;
        background: ${constants.colors.espaceAgentPastel};
        top: 0;
        left: calc(50% - 115px);
        width: 230px;
        text-align: center;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        color: ${constants.colors.espaceAgent};
        font-weight: bold;
        font-size: 0.9rem;
      }

      @media only screen and (min-width: 1px) and (max-width: 992px) {
        .protected-data {
          background: ${constants.colors.espaceAgentPastel};
          top: -14px;
          text-align: center;
          border-radius: 20px;
        }
      }
    `}</style>
  </Section>
);
