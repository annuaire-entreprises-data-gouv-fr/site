import {
  ApplicationRights,
  hasRights,
  isLoggedIn,
} from '#models/authentication/user/rights';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ValidateGroupForm from './_components/validate-group-form';

export const metadata: Metadata = {
  title: 'Configurez votre groupe pour l’Annuaire des Entreprises',
  robots: 'noindex, nofollow',
};

const ConfigurezVotreGroupe = async ({
  params,
}: {
  params: Promise<{ demandeId: string }>;
}) => {
  const session = await getSession();
  const { demandeId } = await params;

  if (!isLoggedIn(session)) {
    return redirect(
      `/api/auth/agent-connect/login?pathFrom=/compte/habilitation/${demandeId}`
    );
  }

  if (!hasRights(session, ApplicationRights.isAgent)) {
    return redirect('/connexion/habilitation/requise');
  }

  return <ValidateGroupForm demandeId={demandeId} />;
};

export default ConfigurezVotreGroupe;
