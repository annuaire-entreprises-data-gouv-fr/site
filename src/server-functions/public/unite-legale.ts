import { notFound, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import z from "zod";
import { HttpNotFound } from "#/clients/exceptions";
import { getEtablissementWithUniteLegaleFromSlug } from "#/models/core/etablissement";
import {
  FetchRechercheEntrepriseException,
  NotASirenError,
  NotASiretError,
  SirenNotFoundError,
  SiretNotFoundError,
} from "#/models/core/types";
import { getUniteLegaleFromSlug } from "#/models/core/unite-legale";
import { Exception } from "#/models/exceptions";
import { extractSirenOrSiretSlugFromUrl } from "#/utils/helpers";
import { logFatalErrorInSentry, logWarningInSentry } from "#/utils/sentry";
import isUserAgentABot from "#/utils/user-agent";

export const getUniteLegaleFromSlugFn = createServerFn()
  .inputValidator(z.object({ slug: z.string(), page: z.number().default(1) }))
  .handler(async ({ data: { slug, page } }) => {
    const sirenSlug = extractSirenOrSiretSlugFromUrl(slug);
    const userAgent = getRequestHeader("user-agent") || "";
    const isBot = isUserAgentABot(userAgent);

    try {
      return await getUniteLegaleFromSlug(sirenSlug, {
        isBot,
        page,
      });
    } catch (e) {
      handleException(e, sirenSlug);
    }
  });

export const getEtablissementWithUniteLegaleFromSlugFn = createServerFn()
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data: { slug } }) => {
    const siretSlug = extractSirenOrSiretSlugFromUrl(slug);
    const userAgent = getRequestHeader("user-agent") || "";
    const isBot = isUserAgentABot(userAgent);

    try {
      return await getEtablissementWithUniteLegaleFromSlug(siretSlug, isBot);
    } catch (e) {
      handleException(e, siretSlug);
    }
  });

function handleException(e: unknown, slug: string): never {
  if (
    e instanceof NotASirenError ||
    e instanceof NotASiretError ||
    e instanceof HttpNotFound
  ) {
    logWarningInSentry(
      new Exception({
        name: "PageNotFoundException",
        cause: e,
        context: { slug },
      })
    );
    throw notFound();
  }
  if (e instanceof SirenNotFoundError || e instanceof SiretNotFoundError) {
    logWarningInSentry(
      new Exception({
        name: "SirenNotFoundOrInvalid",
        cause: e,
        context: { slug },
      })
    );
    throw redirect({ to: "/erreur/introuvable/" + slug });
  }
  if (e instanceof FetchRechercheEntrepriseException) {
    logFatalErrorInSentry(e);
    throw e;
  }
  logFatalErrorInSentry(
    new Exception({
      name: "ServerErrorPageException",
      cause: e,
      context: { slug },
    })
  );
  throw e;
}
