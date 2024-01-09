import { PropsWithChildren } from 'react';
import routes from '#clients/routes';
import ButtonMonComptePro from '#components-ui/button-mon-compte-pro';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/index';

const DocumentWall: React.FC<
  PropsWithChildren<{
    isVisible: boolean;
    title: string;
    id: string;
    uniteLegale: IUniteLegale;
  }>
> = ({ uniteLegale, id, title, isVisible = false, children }) => {
  if (!isVisible) {
    return (
      <Section title={title} id={id} sources={[EAdministration.INPI]}>
        <div className="cta-wrapper">
          <div className="cta-actes layout-center">
            <div>
              <p>
                L’accès à cette section est réservé aux agents du service public
                :
              </p>
              <div className="layout-center">
                <ButtonMonComptePro />
              </div>
              <div>
                Les <b>particuliers, salariés</b> et <b>entrepreneurs</b>,
                peuvent consulter cette donnée sur l’onglet document de{' '}
                <a href={routes.rne.portail.entreprise + uniteLegale.siren}>
                  la page data.inpi.fr de cette entreprise
                </a>
                .
              </div>
              <br />
            </div>
          </div>
          <div className="blur" tab-index="-1">
            <p>
              Cette entreprise possède peut être des document(s) au RNE. Chaque
              document peut contenir un ou plusieurs actes :
            </p>
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
            filter: blur(3px);
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
            }
          }
        `}</style>
      </Section>
    );
  }

  return children;
};

export default DocumentWall;
