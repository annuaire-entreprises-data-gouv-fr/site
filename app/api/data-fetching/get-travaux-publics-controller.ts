import { getTravauxPublic } from '#models/espace-agent/travaux-publics';
import { UseCase } from '#models/user/agent';
import { APIRoutesPaths } from './routes-paths';
import { APIRouteError } from './utils';

export default function getTravauxPublicsController(
  slug: string,
  params: { useCase: UseCase }
) {
  if (!('useCase' in params) || params.useCase in UseCase) {
    throw new APIRouteError(
      'Invalid useCase',
      { slug: params.useCase, route: APIRoutesPaths.EspaceAgentTravauxPublics },
      400
    );
  }
  return getTravauxPublic(slug, params.useCase);
}
