import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { UseCase } from '#models/use-cases';
import { setAgentSession } from '#utils/session';
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

  /**
   * This only updates rights on ajax api calls.
   *
   * Therefore it is very efficient to downgrade agent rights but less effective to upgrade rights as an agent with few rights will not event trigger ajax calls on some pages.
   */
  if (hasRights(session, ApplicationRights.isAgent) && session?.user?.email) {
    const updatedAgent = await getVerifiedAgent(session.user);
    await setAgentSession(updatedAgent, session);
  }

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

  const response = await handler(slug, validatedParams);

  return Response.json(response);
}

export const GET = withHandleError(withSession(withIgnoreBot(getRoute)));
