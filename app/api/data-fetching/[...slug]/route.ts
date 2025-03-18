import { hasRights } from '#models/authentication/user/rights';
import { UseCase } from '#models/use-cases';
import withSession, { IReqWithSession } from '#utils/session/with-session';
import { APIRoutesHandlers } from '../routes-handlers';
import { APIRoutesScopes } from '../routes-scopes';
import {
  APIRouteError,
  getRouteAndSlug,
  IContext,
  withHandleError,
  withIgnoreBot,
} from '../utils';

async function getRoute(request: IReqWithSession, context: IContext) {
  const { slug, route } = await getRouteAndSlug(context);

  if (!(route in APIRoutesHandlers)) {
    throw new APIRouteError('API route not found', { route, slug }, 404);
  }
  const handler = APIRoutesHandlers[route];
  const scope = APIRoutesScopes[route];
  const session = request.session;

  if (!hasRights(session, scope)) {
    throw new APIRouteError(
      'User does not have the required scope for this API route',
      { route, slug },
      403
    );
  }

  const searchParams = Object.fromEntries(new URL(request.url).searchParams);

  const validatedParams = {
    isEI: searchParams.isEI === 'true',
    useCase: searchParams.useCase as UseCase,
  };

  const response = await handler(slug, validatedParams, session);

  return Response.json(response);
}

export const GET = withHandleError(withSession(withIgnoreBot(getRoute)));
