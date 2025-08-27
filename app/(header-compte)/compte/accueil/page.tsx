import { Warning } from '#components-ui/alerts';
import { Badge } from '#components-ui/badge';
import ButtonLink from '#components-ui/button';
import FullWidthContainer from '#components-ui/container';
import AgentNavigation from '#components/espace-agent-components/agent-navigation';
import { FullTable } from '#components/table/full';
import { getAgentFullName } from '#models/authentication/user/helpers';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import constants from '#models/constants';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

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

  const appRights = Object.values(ApplicationRights)
    .filter((scope) => scope !== ApplicationRights.isAgent)
    .map((scope) => [scope, hasRights(session, scope)]);

  const fullName = getAgentFullName(session);

  return (
    <>
      {session?.user?.isSuperAgent && <AgentNavigation />}
      <FullWidthContainer
        style={{
          background: 'var(--annuaire-colors-espaceAgentPastel)',
        }}
      >
        <h1>Bonjour{fullName ? ` ${fullName}` : ''},</h1>
        <p>Découvrez l’espace agent public de l’Annuaire des Entreprises.</p>
        <div className="fr-grid-row fr-grid-row--gutters fr-mb-1w">
          <div className="fr-col-md-6 fr-col-12">
            <div className="fr-card">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <strong className="fr-card__title">
                    Comprendre les données
                  </strong>
                  <p className="fr-card__desc">
                    Quelles sont les sources des données ? Dans quel cadre
                    peut-on les utiliser ?
                  </p>
                </div>
                <div className="fr-card__footer">
                  <ul className="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                    <li>
                      <ButtonLink
                        target="_blank"
                        to={constants.links.documentation.home}
                      >
                        Consulter la documentation
                      </ButtonLink>
                    </li>
                    <li>
                      <ButtonLink alt to="/modalites-utilisation">
                        Modalités d’utilisation
                      </ButtonLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="fr-col-md-6 fr-col-12">
            <div className="fr-card">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <strong className="fr-card__title">
                    Comment s’informer ?
                  </strong>
                  <p className="fr-card__desc">
                    Pour connaître les nouveautés de l’espace agent et de
                    l’Annuaire des Entreprises.
                  </p>
                </div>
                <div className="fr-card__footer">
                  <ul className="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                    <li>
                      <ButtonLink to="/historique-des-modifications">
                        Consulter les nouveautés
                      </ButtonLink>
                    </li>
                    <li>
                      <ButtonLink
                        alt
                        to={constants.links.tchap}
                        target="_blank"
                      >
                        Rejoignez-nous sur Tchap
                      </ButtonLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FullWidthContainer>
      <div className="content-container">
        <h2>Récapitulatif de vos droits d’accès</h2>
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
          body={appRights
            .filter(([_a, b]) => !!b)
            .map(([a, _b]) => {
              return [
                a,
                <Badge
                  icon={'open'}
                  label="oui"
                  backgroundColor="#ddd"
                  fontColor="#666"
                />,
              ];
            })}
        />
      </div>
    </>
  );
};

export default CompteAgentAccueil;
