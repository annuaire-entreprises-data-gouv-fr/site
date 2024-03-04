import { ReactElement } from 'react';
import ButtonAgentConnect from '#components-ui/button-agent-connect';
import Container from '#components-ui/container';
import { LayoutSimple } from '#components/layouts/layout-simple';
import Meta from '#components/meta';
import { administrationsMetaData } from '#models/administrations';
import { NextPageWithLayout } from 'pages/_app';

const LandingPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Espace agent | Annuaire des Entreprises"
      description="Les informations des entreprises sont toutes dans l’espace agent !"
      canonical="https://annuaire-entreprises.data.gouv.fr/lp/agent-public"
      noIndex={false}
    />
    <section className="hero">
      <div>
        <header style={{ marginBottom: '2rem' }}>
          <h1>
            Les informations des entreprises sont toutes dans l’espace agent !
          </h1>
          <p className="fr-text--lead">
            Accessible à toutes les administrations, collectivités et services
            publics de l’Etat.
          </p>
        </header>
        <ButtonAgentConnect />
      </div>
      <img src="/images/lp-agent/secure-folder 1.svg" alt="" />
    </section>
    <section className="fr-grid-row fr-grid-row--gutters value">
      <h2 className="fr-sr-only">Quels avantages pour les agents ?</h2>
      <div className="fr-col-12  fr-col-md-4">
        <h3>Un accès simple et rapide</h3>
        <img src="/images/lp-agent/padlock-security 1.svg" alt="" />
        <p>
          Le bouton AgentConnect vous permet d’accéder facilement à l’espace
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
          rencontrez un problème ? Vos retours sont très précieux pour continuer
          d’améliorer cet espace.
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
        <ButtonAgentConnect />
      </section>
    </Container>
    <section>
      <h3>
        L’Annuaire des Entreprises est opéré par la DINUM, avec le partenariat
        des administrations suivantes :
      </h3>
      <div className="logo-soup">
        {Object.values(administrationsMetaData)
          .sort((a, b) => a.long.localeCompare(b.long))
          .map(({ slug, long, logoType }) =>
            logoType && slug ? (
              <img src={`/images/logos/${slug}.svg`} alt={long} key={slug} />
            ) : null
          )}
      </div>
      <p>
        <a href="/administrations">
          → Voir la liste complète des administrations partenaires
        </a>
      </p>
    </section>
    <style jsx>
      {`
        section.hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .hero header {
          max-width: 500px;
        }
        .hero img {
          width: 400px;
        }

        section.value img {
          height: 100px;
        }

        section {
          margin-bottom: 4rem;
        }
        .logo-soup {
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          padding: 1rem 0;
          flex-wrap: wrap;
        }
        .logo-soup img {
          height: 4rem;
          max-width: 130px;
        }

        @media (max-width: 768px) {
          .hero img {
            display: none;
          }
          section {
            margin-bottom: 2rem;
          }

          section.value img,
          section.value h3 {
            width: 100%;
            text-align: center;
          }
        }
      `}
    </style>
  </>
);

type ICaseExampleProps = {
  title: string;
  description: string;
  image: string;
};
function CaseExample({ title, description, image }: ICaseExampleProps) {
  return (
    <>
      <div className="fr-col-12 fr-col-md-6 case-example">
        <img src={image} alt="" />
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <style jsx>
        {`
          .case-example {
            display: flex;
            align-items: center;
          }
          img {
            margin-right: 20px;
            padding: 4rem;
            padding-top: 0;
            padding-bottom: 4rem;
            margin: 0 -2rem;
            background: radial-gradient(
              circle at center,
              var(--background-alt-blue-france) 0%,
              var(--background-alt-blue-france) 50%,
              #ffffff 50%
            );
          }
          img + * {
            border-left: 2px solid var(--background-alt-blue-france);
            padding-left: 1.5rem;
          }
          @media (max-width: 768px) {
            .case-example {
              flex-wrap: wrap;
              margin-bottom: 2rem;
            }
            img {
              height: 4rem;
              padding: 1rem;
              margin: 0;
              background: var(--background-alt-blue-france);
              border-radius: 0.5rem;
              border-bottom-left-radius: 0;
            }
          }
        `}
      </style>
    </>
  );
}

LandingPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutSimple>{page}</LayoutSimple>;
};

export default LandingPage;
