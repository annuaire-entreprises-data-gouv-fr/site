import { superAgentsList } from '#clients/authentication/super-agents';

import FullWidthContainer from '#components-ui/container';
import { Tag } from '#components-ui/tag';
import { FullTable } from '#components/table/full';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Administrateur',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/admin',
  },
  robots: 'noindex, nofollow',
};

const AdminPage = async () => {
  const session = await getSession();

  if (!hasRights(session, ApplicationRights.administrateur)) {
    return (
      <p>
        Cette page est réservée aux administrateurs de l’Annuaire des
        Entreprises. Vous n’avez pas les droits d’administration et ne pouvez
        donc pas accéder à son contenu.
      </p>
    );
  }

  const data = await superAgentsList.getAllAgents();

  return (
    <>
      <FullWidthContainer>
        <h1>Page Administrateur</h1>
        <p>
          Cette page est réservée aux administrateurs de l’Annuaire des
          Entreprises.
        </p>
        <h2>Liste des agents avec des droits nominatifs</h2>
        <p>
          Contrairement à la majorité des utilisateurs de l’espace agent, ces
          agents ont des droits en leur nom propre et non au nom de
          l’administration à laquelle ils appartiennent.
        </p>
        <FullTable
          head={['Email', 'Cadre', 'Scopes']}
          body={Object.entries(data).map(([key, { scopes, usage }]) => {
            return [key, usage, scopes.map((v) => <Tag key={v}>{v}</Tag>)];
          })}
        />
      </FullWidthContainer>
    </>
  );
};

export default AdminPage;
