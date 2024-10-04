import { IronSession } from 'iron-session';
import { Metadata } from 'next';
import { default as ButtonProConnect } from '#components-ui/button-pro-connect';
import Container from '#components-ui/container';
import { administrationsMetaData } from '#models/administrations';
import { isLoggedIn } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { AppRouterProps } from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import styles from './style.module.css';

export const metadata: Metadata = {
  title: 'Espace agent | L’Annuaire des Entreprises',
  description:
    'Les informations des entreprises sont toutes dans l’espace agent !',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/lp/agent-public',
  },
};

const isLoggedInMessage = (session: IronSession<ISession> | null) => (
  <div>
    Vous êtes connecté en tant que : <strong>{session?.user?.email}</strong>
  </div>
);

const LandingPageAgent = async (props: AppRouterProps) => {
  const { pathFrom } = props.searchParams;
  const session = await getSession();

  return (
    <div className={styles['page']}>
      <section className={styles['hero']}>
        <div>
          <header style={{ marginBottom: '2rem' }}>
            <h1>
              Les informations des entreprises sont toutes dans l’espace agent !
            </h1>
            <p className="fr-text--lead">
              Accessible à toutes les administrations, collectivités et services
              publics de l’Etat.
            </p>
            <p>
              <a href="/cgu" rel="noreferrer noopener" target="_blank">
                Consultez nos conditions générales d’utilisation
              </a>
              .
            </p>
          </header>
          {isLoggedIn(session) ? (
            isLoggedInMessage(session)
          ) : (
            <ButtonProConnect
              useCurrentPathForRediction={false}
              alternatePathForRedirection={pathFrom as string}
              event="BTN_LP_HERO"
            />
          )}
        </div>
        <img src="/images/lp-agent/secure-folder 1.svg" alt="" />
      </section>
      <section
        className={`fr-grid-row fr-grid-row--gutters ${styles['value']}`}
      >
        <h2 className="fr-sr-only">Quels avantages pour les agents ?</h2>
        <div className="fr-col-12  fr-col-md-4">
          <h3>Un accès simple et rapide</h3>
          <img src="/images/lp-agent/padlock-security 1.svg" alt="" />
          <p>
            Le bouton ProConnect vous permet d’accéder facilement à l’espace
            agent grâce à votre adresse email professionnelle.
          </p>
        </div>
        <div className="fr-col-12  fr-col-md-4">
          <h3>Encore plus de données</h3>
          <img src="/images/lp-agent/data-classification 1.svg" alt="" />

          <p>
            En tant qu’agent public, accédez automatiquement aux informations
            protégées des entreprises (non diffusibles, statuts, actes, bilans
            financiers).
          </p>
        </div>
        <div className="fr-col-12  fr-col-md-4">
          <h3>Une équipe à votre écoute</h3>
          <img src="/images/lp-agent/string-phone-communication 1.svg" alt="" />
          <p>
            Vous rêvez d’une nouvelle donnée, d’une fonctionnalité, vous
            rencontrez un problème ? Vos retours sont très précieux pour
            continuer d’améliorer cet espace.
          </p>
        </div>
      </section>
      <section>
        <h2>Comment l’Annuaire vous aide au quotidien ?</h2>
        <div
          className="fr-grid-row fr-grid-row--gutters"
          style={{ marginTop: '1rem' }}
        >
          <CaseExample
            title="Vérifiez facilement l’éligibilité des entreprises en consultant leur bilan financier et leurs statuts."
            description="Pour instruire vos demandes de subventions"
            image="/images/lp-agent/woman-work-with-dashboard 1.svg"
          />
          <CaseExample
            title="Accédez directement aux informations des non diffusibles, sans avoir à leur demander de documents en plus."
            description="Pour aider les entreprises individuelles"
            image="/images/lp-agent/Group.svg"
          />
        </div>
      </section>
      <Container
        style={{
          background: 'var(--background-alt-blue-france)',
        }}
      >
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <h2>Rejoignez les agents qui utilisent déjà l’espace agent !</h2>
          {isLoggedIn(session) ? (
            isLoggedInMessage(session)
          ) : (
            <ButtonProConnect
              useCurrentPathForRediction={false}
              alternatePathForRedirection={pathFrom as string}
              event="BTN_LP_BOTTOM"
            />
          )}
        </section>
      </Container>
      <section>
        <h3>
          L’Annuaire des Entreprises est opéré par la DINUM, avec le partenariat
          des administrations suivantes :
        </h3>
        <div className={styles['logo-soup']}>
          {Object.values(administrationsMetaData)
            .sort((a, b) => a.long.localeCompare(b.long))
            .map(({ slug, long, logoType }) =>
              logoType && slug ? (
                <img src={`/images/logos/${slug}.svg`} alt={long} key={slug} />
              ) : null
            )}
        </div>
        <p>
          <a href="/administration">
            → Voir la liste complète des administrations partenaires
          </a>
        </p>
      </section>
    </div>
  );
};

type ICaseExampleProps = {
  title: string;
  description: string;
  image: string;
};
function CaseExample({ title, description, image }: ICaseExampleProps) {
  return (
    <>
      <div className={`fr-col-12 fr-col-md-6 ${styles['case-example']}`}>
        <img src={image} alt="" />
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </>
  );
}

export default LandingPageAgent;
