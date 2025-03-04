import { superAgentsList } from '#clients/authentication/super-agent-list/agent-list';
import { Badge } from '#components-ui/badge';
import { Tag } from '#components-ui/tag';
import { FullTable } from '#components/table/full';
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

  const allAgentsList = hasRights(session, ApplicationRights.administrateur)
    ? await superAgentsList.getAllAgents()
    : [];

  return (
    <div className="content-container">
      <h1>Votre compte agent public</h1>
      <p>
        Cette page présente la liste des données auxquelles votre compte agent
        public vous donne accès.
      </p>
      <p>
        Nos équipes sont en train de développer le formulaire qui vous permettra
        de faire une demande d’accès aux données auxquelles vous n’avez pas
        encore accès (avec conditions d’éligibilité).
      </p>
      <FullTable
        head={['Données', 'Droit d’accès']}
        body={appRights.map(([a, b]) => {
          return [
            a,
            b ? (
              <Badge
                icon={'open'}
                label="oui"
                backgroundColor="#ddd"
                fontColor="#666"
              />
            ) : (
              <Badge
                icon={'closed'}
                label="non"
                backgroundColor="#ddd"
                fontColor="#666"
              />
            ),
          ];
        })}
      />

      {hasRights(session, ApplicationRights.administrateur) && (
        <>
          <h2>Liste des agents avec des droits nominatifs</h2>
          <FullTable
            head={['Email', 'Scopes']}
            body={Object.entries(allAgentsList).map(([key, values]) => {
              return [key, values.map((v) => <Tag>{v}</Tag>)];
            })}
          />
        </>
      )}
    </div>
  );
};

export default AccountPage;
