import { Badge } from '#components-ui/badge';
import { FullTable } from '#components/table/full';
import { AppScope, hasRights } from '#models/user/rights';
import { getAbsoluteSiteUrl } from '#utils/server-side-helper/app/get-absolute-site-url';
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

  if (!hasRights(session, AppScope.isAgent)) {
    return redirect(getAbsoluteSiteUrl('/lp/agent-public'));
  }

  const appRights = [];
  for (const value in AppScope) {
    const scope = AppScope[value as keyof typeof AppScope];
    if (!(scope === AppScope.isAgent)) {
      appRights.push([scope, hasRights(session, scope)]);
    }
  }

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
    </div>
  );
};

export default AccountPage;
