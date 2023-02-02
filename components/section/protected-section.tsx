import { PropsWithChildren, useState } from 'react';
import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';
import { ISectionProps, Section } from '.';

export const ProtectedSection: React.FC<PropsWithChildren<ISectionProps>> = ({
  title,
  children,
}) => {
  const [understand, setIUnderstand] = useState(false);

  return (
    <Section
      title={title}
      borderColor={constants.colors.espaceAgent}
      titleColor="#fff"
    >
      <div className="protected-data">
        <Icon slug="lockFill">Données sensibles</Icon>
      </div>
      {!understand ? (
        <>
          <p>
            Cette section contient des données sensibles. En y accédant vous
            vous engagez à respecter les CGU et ne consulter que ces
            informations que ....
          </p>
          <div className="layout-center">
            <ButtonLink onClick={() => setIUnderstand(true)}>
              J’ai compris et je souhaite consulter ces données
            </ButtonLink>
          </div>
          <br />
          <div className="blur">
            <div>
              <p>
                Le Lorem Ipsum est simplement texte employé dans simplement du
                est simplement texte employé dans simplement du
              </p>
              <br />
              <p>
                long established fact that a reader will be distracted by the
                readable content of a page when looking at its layout. The point
                of using Lorem Ipsum is that it has a more-or-less normal
                distribution of letters, as opposed to using Content here,
                content here
              </p>
              <p>
                Various versions have evolved over the years, sometimes by
                accident, sometimes on purpose injected humour and
              </p>
            </div>
          </div>
        </>
      ) : (
        children
      )}

      <style jsx>{`
        .protected-data {
          position: absolute;
          background: ${constants.colors.espaceAgent};
          top: 0;
          left: calc(50% - 90px);
          width: 180px;
          text-align: center;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          color: #fff;
          font-weight: bold;
        }
        .blur {
          filter: blur(5px);
          user-select: none;
        }
      `}</style>
    </Section>
  );
};
