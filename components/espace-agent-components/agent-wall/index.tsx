import ButtonAgentConnect from '#components-ui/button-agent-connect';
import { ProtectedSection } from '#components/section/protected-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import constants from '#models/constants';

const AgentWall: React.FC<{
  title: string;
  id?: string;
  sectionIntro?: JSX.Element;
  modalFooter?: JSX.Element;
}> = ({ id, title, sectionIntro = null, modalFooter = null }) => {
  return (
    <ProtectedSection title={title} id={id} sources={[EAdministration.INPI]}>
      {sectionIntro}
      <div className="cta-wrapper">
        <div className="cta-actes">
          <div>
            <div>
              <h3>Vous êtes agent public ?</h3>
              <p>
                En cliquant sur le bouton ci-dessous, vous aurez un
                immédiatement accès à ces données. Cela fonctionne quelque soit
                votre administration, sans création de compte&nbsp;:
              </p>
              <div className="layout-center">
                <ButtonAgentConnect />
              </div>
              <br />
            </div>
            <div className="cta-footer">{modalFooter}</div>
          </div>
        </div>
        <div className="blur" tab-index="-1" aria-hidden>
          <p>Voici une liste de présidents de la République Française :</p>
          <FullTable
            head={['Date de dépôt', 'Acte(s) contenu(s)']}
            body={[
              ['Charles', 'de Gaulle'],
              ['Jacques', 'Chirac'],
              ['Félix', 'Faure'],
              ['Georges', 'Pompidou'],
              ['François', 'Mitterrand'],
              ['René', 'Coty'],
              ['Valéry', "Giscard d'Estaing"],
              ['Nicolas', 'Sarkozy'],
              ['Emmanuel', 'Macron'],
              ['Adolphe', 'Thiers'],
            ].map(([a, b]) => [a, b])}
          />
        </div>
      </div>
      <style jsx>{`
        .cta-wrapper {
          position: relative;
        }
        .blur {
          filter: blur(4px);
          user-select: none;
          bubble-event: none;
          pointer-events: none;
        }
        .cta-actes {
          padding: 20px 20%;
          position: absolute;
          top: 0;
          z-index: 10;
          height: 100%;
          width: 100%;
        }

        .cta-actes > div {
          background-color: #fff;
          box-shadow: 0 0 20px 0 rgba(0.5, 0.5, 0.5, 0.1);
          border: 1px solid rgba(0.5, 0.5, 0.5, 0.1);
          border-radius: 3px;
        }

        .cta-actes > div > div {
          padding: 10px 30px;
        }

        .cta-footer {
          font-size: 0.9rem;
          background-color: ${constants.colors.lightGrey};
        }

        @media only screen and (min-width: 1px) and (max-width: 768px) {
          .blur {
            display: none;
          }
          .cta-actes {
            padding: 0;
            position: relative;
          }
          .cta-actes > div {
            padding: 0;
            box-shadow: none;
            border: none;
          }

          .cta-footer {
            font-size: 0.9rem;
            background-color: transparent;
          }
        }
      `}</style>
    </ProtectedSection>
  );
};

export default AgentWall;
