import ButtonAgentConnect from '#components-ui/button-agent-connect';
import FloatingModal from '#components-ui/floating-modal';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import style from './style.module.css';

const AgentWall: React.FC<{
  title: string;
  id?: string;
  sectionIntro?: JSX.Element;
  modalFooter?: JSX.Element;
}> = ({ id, title, sectionIntro = null, modalFooter = null }) => {
  return (
    <Section title={title} id={id} sources={[EAdministration.INPI]} isProtected>
      {sectionIntro}
      <div className={style['cta-wrapper']}>
        <FloatingModal
          agentColor
          className={style['cta-actes']}
          footer={modalFooter}
          noMobile
        >
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
            Disponible pour toutes les administrations, sans création de compte.
          </p>
          <ButtonAgentConnect useCurrentPathForRediction />
        </FloatingModal>
        <div className={style['blur']} tab-index="-1" aria-hidden>
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
    </Section>
  );
};

export default AgentWall;
