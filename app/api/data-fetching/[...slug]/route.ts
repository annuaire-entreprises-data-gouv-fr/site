import { hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { APIRoutesHandlers } from '../routes-handlers';
import { APIRoutesScopes } from '../routes-scopes';
import {
  APIRouteError,
  getRouteAndSlug,
  IContext,
  withHandleError,
  withIgnoreBot,
} from '../utils';

async function getRoute(
  request: Request,
  context: IContext,
  session: ISession
) {
  const { slug, route } = await getRouteAndSlug(context);

  if (!(route in APIRoutesHandlers)) {
    throw new APIRouteError('API route not found', { route, slug }, 404);
  }
  const handler = APIRoutesHandlers[route];
  const scope = APIRoutesScopes[route];
  if (!hasRights(session, scope)) {
    throw new APIRouteError(
      'User does not have the required scope for this API route',
      { route, slug },
      403
    );
  }
  const searchParams = Object.fromEntries(
    new URL(request.url).searchParams
  ) as Parameters<typeof handler>[1];

  const response = await handler(slug, searchParams!);

  return Response.json(response);
}

export const GET = withHandleError(withIgnoreBot(getRoute));
