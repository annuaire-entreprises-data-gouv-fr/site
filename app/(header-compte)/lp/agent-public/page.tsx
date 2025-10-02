import ButtonLink from '#components-ui/button';
import { default as ButtonProConnect } from '#components-ui/button-pro-connect';
import FullWidthContainer from '#components-ui/container';
import { SimpleSeparator } from '#components-ui/horizontal-separator';
import { Icon } from '#components-ui/icon/wrapper';
import { Tag } from '#components-ui/tag';
import { Section } from '#components/section';
import { administrationsMetaData } from '#models/administrations';
import { isLoggedIn } from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import constants from '#models/constants';
import { shouldAddNoIndex } from '#utils/seo/noindex-query-params';
import { AppRouterProps } from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';
import styles from './style.module.css';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const searchParams = await props.searchParams;

  return {
    title: 'Espace agent | L’Annuaire des Entreprises',
    description:
      'Les informations des entreprises sont toutes dans l’espace agent !',
    robots: shouldAddNoIndex(searchParams)
      ? 'noindex, follow'
      : 'index, follow',
    alternates: {
      canonical: 'https://annuaire-entreprises.data.gouv.fr/lp/agent-public',
    },
  };
};

const isLoggedInMessage = (session: ISession | null) => (
  <div>
    Vous êtes connecté en tant que : <strong>{session?.user?.email}</strong>
  </div>
);

const LandingPageAgent = async (props: AppRouterProps) => {
  const session = await getSession();

  return (
    <div className={styles['page']}>
      <section className={styles['hero']}>
        <div>
          <header style={{ marginBottom: '2rem' }}>
            <h1>Agents publics, votre temps est précieux !</h1>
            <p className="fr-text--lead">
              Accédez à toutes les données publiques des entreprises et des
              associations. C’est gratuit, pour toutes les administrations.
            </p>
            <a
              href="/modalites-utilisation"
              rel="noreferrer noopener"
              target="_blank"
            >
              Consultez nos modalités d’utilisation
            </a>
          </header>
          {isLoggedIn(session) ? (
            isLoggedInMessage(session)
          ) : (
            <ButtonProConnect
              noFootLink
              shouldRedirectToReferer
              event="BTN_LP_HERO"
            />
          )}
        </div>
        <img src="/images/lp-agent/secure-folder 1.svg" alt="" />
      </section>
      <FullWidthContainer>
        <h2>
          Toutes les données des entreprises et des associations, au même
          endroit
        </h2>
        <p>
          Plus besoin de redemander les pièces justificatives et les documents
          aux entreprises, tout est <strong>déjà</strong> dans l’Annuaire des
          Entreprises !
        </p>
        <section
          className={`fr-grid-row fr-grid-row--gutters ${styles['value']}`}
        >
          <div className="fr-col-12  fr-col-md-4">
            <Section title="Site grand public">
              <i>Accessible à toutes et à tous</i>
              <SimpleSeparator />
              <ul>
                <li>Dénomination, adresse etc.</li>
                <li>N° TVA et EORI</li>
                <li>Justificatifs d’existence</li>
                <li>Annonces légales</li>
                <li>Dirigeant(e)s</li>
                <li>Qualiopi, BIO et RGE</li>
                <li>Label entreprise inclusive</li>
                <li>Index Egapro</li>
                <li>Qualité ESS</li>
                <li>Comptes de résultats</li>
                <li>Élus et dirigeants d’administration</li>
              </ul>
            </Section>
          </div>
          <div className="fr-col-12  fr-col-md-8">
            <Section title="Espace agent public" isProtected>
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12  fr-col-md-6">
                  <i>Accessible aux administrations, sans conditions</i>
                  <SimpleSeparator />
                  <ul>
                    <li>Données des non-diffusibles</li>
                    <li>Date de naissance des dirigeant(e)s</li>
                    <li>Comparaison des dirigeants RCS/RNE</li>
                    <li>Qualibat, OPQIBI, Qualifelec</li>
                    <li>Dirigeant(e)s des associations</li>
                    <li>Documents des associations (PDF)</li>
                    <li>Documents et actes au RNE (PDF)</li>
                    <li>Bilans au RNE (PDF)</li>
                    <li>Subventions des associations</li>
                  </ul>
                </div>
                <div className="fr-col-12  fr-col-md-6">
                  <i>Sous condition d’habilitation juridique</i>
                  <SimpleSeparator />
                  <ul>
                    <li>
                      Conformité fiscale, sociale et MSA
                      <span className={styles['asterix-et-obelix']}>*</span>
                    </li>
                    <li>
                      Effectifs annuels
                      <span className={styles['asterix-et-obelix']}>*</span>
                    </li>
                    <li>
                      Chiffres d’affaires
                      <span className={styles['asterix-et-obelix']}>*</span>
                    </li>
                    <li>
                      Liens capitalistiques
                      <span className={styles['asterix-et-obelix']}>*</span>
                    </li>
                    <li>
                      Bilans de la Banque de France
                      <span className={styles['asterix-et-obelix']}>*</span>
                    </li>
                    <li>
                      Travaux publics (CIBTP, CNETP, ProBTP, FNTP)
                      <span className={styles['asterix-et-obelix']}>*</span>
                    </li>
                    <li>
                      Liasses fiscales
                      <span className={styles['asterix-et-obelix']}>*</span>
                    </li>
                    <li>
                      Registre des Bénéficiaires Effectifs
                      <span className={styles['asterix-et-obelix']}>*</span>
                    </li>
                  </ul>
                  <span className={styles['asterix-et-obelix']}>*</span>
                  <i>
                    🚧 fonctionnalité en cours de construction.{' '}
                    <a href={constants.links.tchap}>Suivez-nous sur Tchap</a>{' '}
                    pour être informé(e) des avancées.
                  </i>
                </div>
              </div>
              <SimpleSeparator />
              <div className="layout-center">
                {isLoggedIn(session) ? (
                  isLoggedInMessage(session)
                ) : (
                  <ButtonProConnect
                    shouldRedirectToReferer
                    event="BTN_LP_HERO"
                  />
                )}
              </div>
            </Section>
          </div>
        </section>
      </FullWidthContainer>
      <FullWidthContainer
        style={{
          background: 'var(--annuaire-colors-pastelBlue)',
        }}
      >
        <section>
          <h2>Comment l’Annuaire vous aide au quotidien ?</h2>
          <div className={styles['case-example']}>
            <div>
              <Tag color="agent">
                <Icon slug="lockFill">Écarter les risques de fraude</Icon>
              </Tag>
              <img src="/images/lp-agent/illu_fraude.svg" alt="" />
              <div>
                <p>
                  J’ai directement accès aux informations des entreprises
                  non-diffusibles, sans avoir à leur demander de documents en
                  plus !
                </p>
                <div>
                  <strong>Chargé du calcul de la cotisation CFE</strong>
                </div>
                <i>Administration centrale</i>
              </div>
            </div>
            <div>
              <Tag color="agent">
                <Icon slug="lockFill">Instruire un marché public</Icon>
              </Tag>
              <img src="/images/lp-agent/illu_marchepublic.svg" alt="" />
              <div>
                <p>
                  Je dois vérifier que nos titulaires sont toujours à jour de
                  leurs obligations fiscales et sociales pour une attribution et
                  un suivi des marchés publics.
                </p>
                <div>
                  <strong>Chargé de mission de la commande publique</strong>
                </div>
                <i>Administration déconcentrée</i>
              </div>
            </div>
          </div>
        </section>
      </FullWidthContainer>
      <br />
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <h2>
          Rejoignez les agents qui utilisent déjà l’Annuaire des Entreprises !
        </h2>
        <ButtonLink to={constants.links.tchap}>
          Rejoindre la communauté sur Tchap
        </ButtonLink>
      </section>
      <br />
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

export default LandingPageAgent;
