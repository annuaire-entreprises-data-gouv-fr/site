import { Badge } from '#components-ui/badge';
import ButtonLink from '#components-ui/button';
import FullWidthContainer from '#components-ui/container';
import { FullTable } from '#components/table/full';
import { getAgentFullName } from '#models/authentication/user/helpers';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Votre compte utilisateur de l’Annuaire des Entreprises',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/compte',
  },
  robots: 'noindex, nofollow',
};

const AccountPage = async () => {
  const session = await getSession();

  if (!hasRights(session, ApplicationRights.isAgent)) {
    return redirect('/lp/agent-public');
  }

  const appRights = [];
  for (const value in ApplicationRights) {
    const scope = ApplicationRights[value as keyof typeof ApplicationRights];
    if (!(scope === ApplicationRights.isAgent)) {
      appRights.push([scope, hasRights(session, scope)]);
    }
  }

  const fullName = getAgentFullName(session);

  return (
    <>
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
                      <ButtonLink to="https://tchap.gouv.fr/#/room/#annuaire-entreprises:agent.dinum.tchap.gouv.fr">
                        Rejoindre la communauté Tchap
                      </ButtonLink>
                    </li>
                    <li>
                      <ButtonLink alt to="/historique-des-modifications">
                        Consulter l’historique des changements
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
                    Comprendre le projet
                  </strong>
                  <p className="fr-card__desc">
                    Quelles sont les sources ? Que signifie telle ou telle
                    donnée ? Tout est dans la documentation.
                  </p>
                </div>
                <div className="fr-card__footer">
                  <ul className="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                    {/* <li>
                      <ButtonLink to="/historique-des-modifications">
                        Consulter la documentation
                      </ButtonLink>
                    </li> */}
                    <li>
                      <ButtonLink alt to="/cgu">
                        Consulter les modalités d’utilisation
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
                // <a rel="noreferre noopener" target="_blank" href={'#'}>
                //   → en savoir plus
                // </a>,
              ];
            })}
        />
      </div>
    </>
  );
};

export default AccountPage;
