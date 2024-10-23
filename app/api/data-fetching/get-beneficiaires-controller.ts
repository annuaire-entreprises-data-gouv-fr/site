import { getBeneficiaires } from '#models/espace-agent/beneficiaires';
import { UseCase } from '#models/user/agent';
import { APIRoutesPaths } from './routes-paths';
import { APIRouteError } from './utils';

export default function getBeneficiairesController(
  slug: string,
  params: { useCase: UseCase }
) {
  if (!('useCase' in params) || params.useCase in UseCase) {
    throw new APIRouteError(
      'Invalid useCase',
      { slug: params.useCase, route: APIRoutesPaths.EspaceAgentBeneficiaires },
      400
    );
  }
  return getBeneficiaires(slug, params.useCase);
}
