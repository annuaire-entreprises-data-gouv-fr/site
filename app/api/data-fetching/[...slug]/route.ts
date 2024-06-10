import { Exception } from '#models/exceptions';
import { hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import logErrorInSentry, { logInfoInSentry } from '#utils/sentry';
import { withAntiScrapping } from '#utils/server-side-helper/app/with-anti-bot';
import { APIHandler, APIPath, APIRoutesScope } from '../routesHandler';

async function getRoute(
  _request: Request,
  params: { params: { slug: Array<string> } },
  /* The `session` parameter in the `getRoute` function is an object of type `ISession` representing
  the user session. It contains information about the current user's session, such as user details,
  permissions, and any other relevant data needed to process the request. The `session` object is
  used to check if the user has the necessary rights or scopes to access a specific API route before
  handling the request. */
  session: ISession
) {
  const { slug, route } = getRouteAndSlug(params);

  if (!(route in APIHandler)) {
    throw new APIRouteError('API route not found', { route, slug }, 404);
  }
  const handler = APIHandler[route as APIPath];
  const scope = APIRoutesScope[route as APIPath];
  if (!hasRights(session, scope)) {
    throw new APIRouteError(
      'User does not have the required scope for this API route',
      { route, slug },
      403
    );
  }

  const response = await handler(slug);

  return new Response(JSON.stringify(response), { status: 200 });
}

export const GET = withHandleError(withAntiScrapping(getRoute));

function withHandleError(handler: any) {
  return async function (request: Request, params: any) {
    try {
      return await handler(request, params);
    } catch (e: any) {
      if (e instanceof APIRouteError) {
        logInfoInSentry(e);
        return new Response(e.message, { status: e.status });
      }

      let routeAndSlug;
      try {
        routeAndSlug = getRouteAndSlug(params);
      } catch (e) {
        routeAndSlug = { route: '', slug: '' };
      }
      const error = new APIRouteError(
        'Internal Server Error',
        routeAndSlug,
        500,
        e
      );
      logErrorInSentry(error);
      return new Response(error.message, { status: error.status });
    }
  };
}

function getRouteAndSlug(params: { params: { slug: Array<string> } }) {
  const slug = params.params.slug.at(-1) as string;
  const route = params.params.slug.slice(0, -1).join('/');
  return { route, slug };
}

class APIRouteError extends Exception {
  constructor(
    message: string,
    context: { route: string; slug: string },
    public status: 404 | 403 | 500,
    cause?: any
  ) {
    super({
      name: 'APIRouteError',
      message,
      context: { page: context.route, slug: context.slug },
      cause,
    });
    this.name = 'APIRouteError';
  }
}
