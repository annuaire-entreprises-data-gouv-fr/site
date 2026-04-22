import type { TNatureEffectif } from "#clients/api-entreprise/effectifs/types";
import { hasRights } from "#models/authentication/user/rights";
import type { UseCase } from "#models/use-cases";
import withSession, { type IReqWithSession } from "#utils/session/with-session";
import { APIRoutesHandlers } from "../routes-handlers";
import { APIRoutesScopes } from "../routes-scopes";
import {
  APIRouteError,
  getRouteAndSlug,
  type IContext,
  withHandleError,
  withIgnoreBot,
} from "../utils";

async function getRoute(request: IReqWithSession, context: IContext) {
  const { slug, route } = await getRouteAndSlug(context);

  if (!(route in APIRoutesHandlers)) {
    throw new APIRouteError("API route not found", { route, slug }, 404);
  }
  const handler = APIRoutesHandlers[route];
  const scope = APIRoutesScopes[route];
  const session = request.session;

  if (!hasRights(session, scope)) {
    throw new APIRouteError(
      "User does not have the required scope for this API route",
      { route, slug },
      403
    );
  }

  const searchParams = Object.fromEntries(new URL(request.url).searchParams);

  const validatedParams: {
    isEI: boolean;
    natureEffectif: TNatureEffectif;
    useCase: UseCase;
    year: string;
    page?: number;
    signal: AbortSignal;
  } = {
    isEI: searchParams.isEI === "true",
    natureEffectif:
      (searchParams.natureEffectif as TNatureEffectif | undefined) ?? "moyen",
    useCase: searchParams.useCase as UseCase,
    year: searchParams.year,
    page: searchParams.page
      ? Number.parseInt(searchParams.page, 10)
      : undefined,
    signal: request.signal,
  };

  const response = await handler(slug, validatedParams, session);

  return Response.json(response);
}

export const GET = withHandleError(withSession(withIgnoreBot(getRoute)));
