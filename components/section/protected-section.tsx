import { PropsWithChildren, useState } from 'react';
import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';
import { ISectionProps, Section } from '.';

export const ProtectedSection: React.FC<PropsWithChildren<ISectionProps>> = ({
  title,
  children,
  sources,
}) => {
  const [understand, setIUnderstand] = useState(false);

  return (
    <Section
      title={title}
      borderColor={constants.colors.espaceAgentPastel}
      titleColor={constants.colors.espaceAgent}
      sources={sources}
    >
      <div className="protected-data">
        <Icon size={12} slug="lockFill">
          Données sensibles
        </Icon>
      </div>
      {children}
      <style jsx>{`
        .protected-data {
          position: absolute;
          background: ${constants.colors.espaceAgentPastel};
          top: 0;
          left: calc(50% - 80px);
          width: 160px;
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
};
