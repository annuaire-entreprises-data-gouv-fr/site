import ButtonMonComptePro from '#components-ui/button-mon-compte-pro';
import { ProtectedSection } from '#components/section/protected-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';

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
        <div className="cta-actes layout-center">
          <div>
            <p>
              <b>Vous êtes agent public ?</b>
            </p>
            <div className="layout-center">
              <ButtonMonComptePro />
            </div>
            {modalFooter}
          </div>
        </div>
        <div className="blur" tab-index="-1" aria-hidden>
          <p>Voici la liste de 7 présidents de la république française :</p>
          <FullTable
            head={['Date de dépôt', 'Acte(s) contenu(s)']}
            body={[
              ['Charles', 'de Gaulle'],
              ['Jacques', 'Chirac'],
              ['Georges', 'Pompidou'],
              ['François', 'Mitterrand'],
              ['Valéry', "Giscard d'Estaing"],
              ['Nicolas', 'Sarkozy'],
              ['Emmanuel', 'Macron'],
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
          border-radius: 3px;
          padding: 0 30px;
          box-shadow: 0 0 20px 0 rgba(0.5, 0.5, 0.5, 0.1);
          border: 1px solid rgba(0.5, 0.5, 0.5, 0.1);
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
        }
      `}</style>
    </ProtectedSection>
  );
};

export default AgentWall;
