import FullWidthContainer from '#components-ui/container';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ValidateGroupForm from './validate-group-form';

export const metadata: Metadata = {
  title: 'Configurez votre groupe pour l’Annuaire des Entreprises',
  alternates: {
    canonical:
      'https://annuaire-entreprises.data.gouv.fr/compte/configurez-votre-groupe',
  },
  robots: 'noindex, nofollow',
};

const ConfigurezVotreGroupe = async ({
  params,
}: {
  params: Promise<{ demandeId: string }>;
}) => {
  const session = await getSession();
  const { demandeId } = await params;

  if (!hasRights(session, ApplicationRights.isAgent)) {
    return redirect('/lp/agent-public');
  }

  return (
    <FullWidthContainer
      style={{
        background: 'var(--annuaire-colors-espaceAgentPastel)',
      }}
    >
      <div className="fr-mt-4w fr-mb-12w">
        <div className="fr-card">
          <div className="fr-card__body">
            <div className="fr-card__content">
              <div className="fr-grid-row fr-grid-row--gutters fr-mt-1w fr-mb-1w">
                <ValidateGroupForm demandeId={demandeId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FullWidthContainer>
  );
};

export default ConfigurezVotreGroupe;
