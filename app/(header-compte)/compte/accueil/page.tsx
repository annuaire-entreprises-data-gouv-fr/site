import { Warning } from '#components-ui/alerts';
import { Badge } from '#components-ui/badge';
import ButtonLink from '#components-ui/button';
import FullWidthContainer from '#components-ui/container';
import AgentNavigation from '#components/espace-agent-components/agent-navigation';
import { FullTable } from '#components/table/full';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import constants from '#models/constants';
import { changelogData } from '#models/historique-modifications';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

const lastChangelog = changelogData[0];

export const metadata: Metadata = {
  title: 'Votre compte utilisateur de l’Annuaire des Entreprises',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/compte/accueil',
  },
  robots: 'noindex, nofollow',
};

const CompteAgentAccueil = async () => {
  const session = await getSession();

  if (!hasRights(session, ApplicationRights.isAgent)) {
    return redirect('/lp/agent-public');
  }

  const canSeeDatapassLink = hasRights(
    session,
    ApplicationRights.administrateur
  );

  const appRights = Object.values(ApplicationRights)
    .filter((scope) => scope !== ApplicationRights.isAgent)
    .map((scope) => [scope, hasRights(session, scope)])
    .filter(([a, b]) => canSeeDatapassLink || b);

  return (
    <>
      {session?.user?.isSuperAgent && <AgentNavigation />}
      <section className="layout-space-between-start">
        <div style={{ maxWidth: '50%' }}>
          <h1>Bienvenue dans votre espace agent</h1>
          <p>
            Accédez à toutes les données publiques des entreprises et des
            associations, pour faciliter vos missions.
          </p>
          <ButtonLink to="#droits-acces">
            Consultez la liste des données
          </ButtonLink>
        </div>
        <img src="/images/lp-agent/secure-folder 1.svg" alt="" />
      </section>
      <FullWidthContainer
        style={{
          background:
            'radial-gradient(61.94% 118.71% at 36.66% 38.06%, #F9C5E1 0%, #D8E6FF 100%)',
          padding: '3rem 2rem 2rem 2rem',
        }}
      >
        <div className="fr-grid-row fr-grid-row--gutters fr-mb-1w">
          <div className="fr-col-md-4 fr-col-12">
            <div className="fr-card">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <strong className="fr-card__title">Nouveautés</strong>
                  <p className="fr-card__desc">
                    <strong>{lastChangelog.date}</strong> :{' '}
                    {lastChangelog.htmlBody}
                  </p>
                </div>
                <div className="fr-card__footer">
                  <ButtonLink to="/historique-des-modifications" alt small>
                    Voir toutes les nouveautés
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>

          <div className="fr-col-md-4 fr-col-12">
            <div className="fr-card">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <strong className="fr-card__title">
                    Les données, ce sont des droits et des devoirs
                  </strong>
                  <p className="fr-card__desc">
                    Vous avez accès à des données dans le strict cadre de votre
                    mission professionnelle.
                  </p>
                  <p className="fr-card__desc">
                    Retrouvez les responsabilités et les contraintes qui
                    entourent cet accès privilégié dans notre documentation et
                    nos{' '}
                    <a href="/modalites-utilisation">modalités d’utilisation</a>
                    .
                  </p>
                </div>
                <div className="fr-card__footer">
                  <ButtonLink
                    target="_blank"
                    alt
                    small
                    to={constants.links.documentation.home}
                  >
                    Accéder à notre documentation
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>

          <div className="fr-col-md-4 fr-col-12">
            <div className="fr-card">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <strong className="fr-card__title">
                    Le Tchap de l’Annuaire
                  </strong>
                  <p className="fr-card__desc">
                    Rejoignez notre équipe et les autres utilisateurs de
                    l’Annuaire sur notre salon Tchap !
                  </p>
                  <p className="fr-card__desc">
                    Partagez vos questions, vos souhaits, vos idées pour
                    améliorer l’Annuaire.
                  </p>
                </div>
                <div className="fr-card__footer">
                  <ButtonLink
                    alt
                    to={constants.links.tchap}
                    target="_blank"
                    small
                  >
                    Rejoindre le salon Tchap
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FullWidthContainer>
      <div className="content-container">
        <h2 id="droits-acces">Les données auxquelles vous avez accès</h2>
        {session?.user?.agentIsNotVerified && (
          <Warning>
            <strong>Attention</strong>, vous faites partie d’un groupe qui
            devrait vous donner accès à des données supplémentaires, mais votre
            compte n’est pas encore <strong>activé</strong>.
            <br />
            <a
              href="https://roles.data.gouv.fr/ui/activation"
              target="_blank"
              rel="noreferrer noopener"
            >
              Activez votre compte
            </a>
            , puis déconnectez-vous et reconnectez-vous .
          </Warning>
        )}
        <p>
          Voici la liste des données auxquelles vous avez actuellement accès en
          tant qu’agent public.
        </p>

        <FullTable
          head={['Données', 'Droits']}
          body={appRights.map(([a, b]) => {
            return [
              a,
              <Badge
                icon={b ? 'open' : 'closed'}
                label={b ? 'Oui' : 'Non'}
                backgroundColor="#ddd"
                fontColor="#666"
              />,
            ];
          })}
        />
      </div>

      {canSeeDatapassLink && (
        <div className="content-container">
          <h2>Les données supplémentaires</h2>
          <p>
            Si votre <strong>mission le justifie</strong>, vous pouvez débloquer
            l’accès aux données marquées{' '}
            <Badge
              icon={'closed'}
              label={'Non'}
              backgroundColor="#ddd"
              fontColor="#666"
            />
            . Les missions qui permettent d’être habilité sont :
          </p>
          <ul>
            <li>Lutte contre la fraude</li>
            <li>Commande publique / marchés publics</li>
            <li>Subventions aux associations</li>
            <li>Aides publiques</li>
          </ul>
          <br />
          <ButtonLink
            to={`${process.env.DATAPASS_URL}/demandes/annuaire-des-entreprises/nouveau`}
          >
            Demander une habilitation
          </ButtonLink>
        </div>
      )}
    </>
  );
};

export default CompteAgentAccueil;
