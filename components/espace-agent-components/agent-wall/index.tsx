import ButtonProConnect from '#components-ui/button-pro-connect';
import FloatingModal from '#components-ui/floating-modal';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import style from './style.module.css';

const AgentWall: React.FC<{
  title: string;
  id?: string;
  sectionIntro?: React.JSX.Element;
  modalFooter?: React.JSX.Element;
  sources?: EAdministration[];
}> = ({ id, title, sectionIntro = null, modalFooter = null, sources = [] }) => {
  return (
    <Section title={title} id={id} sources={sources} isProtected>
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
            Accédez immédiatement à ces données sur{' '}
            <a href="/lp/agent-public">l’espace agent public</a>.{' '}
            <>
              En vous connectant vous acceptez nos{' '}
              <a
                href="/modalites-utilisation"
                rel="noreferrer noopener"
                target="_blank"
              >
                modalités d’utilisation
              </a>
              .
            </>
          </p>
          <ButtonProConnect event="AGENT_WALL" noFootLink />
          <a href="/lp/agent-public">⇢ Découvrir l’espace agent public</a>
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
              ['Chargé de déploiement', 'Relations avec les administrations'],
              ['Chargé de marketing', 'SEO, communication'],
              ['Product Manager', 'Gestion du produit'],
              ['Designer', 'UX, UI, Product designer'],
              ['Chargé des relations usagers', 'Outils de support'],
            ].map(([a, b]) => [a, b])}
          />
        </div>
      </div>
    </Section>
  );
};

export default AgentWall;
