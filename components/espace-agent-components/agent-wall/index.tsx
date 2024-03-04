import ButtonAgentConnect from '#components-ui/button-agent-connect';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';

const AgentWall: React.FC<{
  title: string;
  id?: string;
  sectionIntro?: JSX.Element;
  modalFooter?: JSX.Element;
}> = ({ id, title, sectionIntro = null, modalFooter = null }) => {
  return (
    <Section title={title} id={id} sources={[EAdministration.INPI]} isProtected>
      {sectionIntro}
      <div className="cta-wrapper">
        <div className="cta-actes">
          <div>
            <div>
              <h3>Vous êtes agent public ?</h3>
              <p>
                Accédez immédiatement à ces données en continuant avec le bouton{' '}
                <a
                  href="https://agentconnect.gouv.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Qu’est-ce que AgentConnect ? - nouvelle fenêtre"
                >
                  AgentConnect
                </a>
                .
              </p>
              <p>
                Disponible pour toutes les administrations, sans création de
                compte.
              </p>
              <ButtonAgentConnect usePathFrom />
            </div>
            <div className="cta-footer">{modalFooter}</div>
          </div>
        </div>
        <div className="blur" tab-index="-1" aria-hidden>
          <p>
            Nous recrutons ! Consultez notre{' '}
            <a href="https://www.numerique.gouv.fr/rejoignez-nous/">
              page carrière
            </a>{' '}
            ou{' '}
            <a href="https://beta.gouv.fr/recrutement/">celle de beta.gouv</a>.
          </p>
          <FullTable
            head={['Métier', 'Description']}
            body={[
              ['Intrapreneurs', 'Le/la responsable du service numérique'],
              ['Développeur frontend', 'React, Vue, Rails etc.'],
              ['Développeur backend', 'Typescript, Rails, Python etc.'],
              ['Data Engineer', 'Airflow, Python'],
              ['Devops', 'Ansible, Scalingo, OVH'],
              [
                'Chargé de déploiement',
                'SEO, relations avec les administrations',
              ],
              ['Designer', 'UX, UI, Product designer'],
              ['Chargé de communication', 'X, Linkedin, newsletters internes'],
              ['Chargé des relations usagers', 'Outils de support'],
            ].map(([a, b]) => [a, b])}
          />
        </div>
      </div>
      <style jsx>{`
        .cta-wrapper {
          position: relative;
        }
        .blur {
          filter: blur(6px);
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

        .cta-actes > div > div:first-of-type {
          padding: 0 30px 20px;
        }

        .cta-footer {
          padding: 10px 30px;
          font-size: 0.9rem;
          background-color: var(--background-alt-grey);
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
    </Section>
  );
};

export default AgentWall;
