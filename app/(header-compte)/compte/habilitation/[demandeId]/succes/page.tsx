import ButtonLink from '#components-ui/button';
import { Tag } from '#components-ui/tag';
import {
  ApplicationRights,
  hasRights,
  isLoggedIn,
} from '#models/authentication/user/rights';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Configurez votre groupe pour l’Annuaire des Entreprises',
  robots: 'noindex, nofollow',
};

const ConfigurezVotreGroupe = async ({
  params,
  searchParams,
}: {
  params: Promise<{ demandeId: string }>;
  searchParams: Promise<{ scopes: string }>;
}) => {
  const session = await getSession();
  const { demandeId } = await params;
  const { scopes } = await searchParams;

  if (!isLoggedIn(session)) {
    return redirect(
      `/api/auth/agent-connect/login?pathFrom=/compte/habilitation/${demandeId}`
    );
  }

  if (!hasRights(session, ApplicationRights.isAgent)) {
    return redirect('/connexion/habilitation/requise');
  }

  return (
    <>
      <div className="fr-col-8">
        <h1 className="fr-card__title">
          Vos nouveaux droits ont été enregistrés avec succès !
        </h1>
        <p>
          Vous pouvez commencer désormais à utiliser vos nouveaux droits dans
          l’espace agent de l’Annuaire des Entreprises :{' '}
        </p>
      </div>
      {(scopes || '').split(' ').map((s) => (
        <>
          <Tag>{s}</Tag>{' '}
        </>
      ))}
      <div className="fr-col-8">
        <p>
          Pour consultez vos droits, vous pouvez consulter la{' '}
          <a href="/compte/accueil">page ”Mes droits”</a>.
        </p>
        <p>
          Il vous est également possible d’ajouter vos collègues a votre groupe
          sur la <a href="/compte/mes-groupes">page ”Mes Groupes”</a>.
        </p>
        <ul className="fr-card__desc fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg">
          <li>
            <ButtonLink alt small>
              Voir mes droits
            </ButtonLink>
          </li>
          <li>
            <ButtonLink to="/compte/accueil" small>
              Gérer mes groupes
            </ButtonLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ConfigurezVotreGroupe;
