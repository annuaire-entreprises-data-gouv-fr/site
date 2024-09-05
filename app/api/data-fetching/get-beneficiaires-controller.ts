import { getBeneficiaires } from '#models/espace-agent/beneficiaires';
import { UseCase } from '#models/user/agent';
import { APIRouteError } from './utils';

export default function getBeneficiairesController(
  slug: string,
  params: { useCase: UseCase }
) {
  if (!('useCase' in params) || params.useCase in UseCase) {
    throw new APIRouteError(
      'Invalid useCase',
      { slug: params.useCase, route: beneficiaireRoute },
      400
    );
  }
  return getBeneficiaires(slug, params.useCase);
}

export const beneficiaireRoute = 'espace-agent/beneficiaires';
