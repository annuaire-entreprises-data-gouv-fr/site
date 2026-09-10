import { notFound, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { HttpNotFound } from "#/clients/exceptions";
import { getFondationFromSlug } from "#/models/core/fondation";
import {
  IdRnfNotFoundError,
  NotAnIdRnfError,
} from "#/models/core/fondations.types";
import { FetchRechercheEntrepriseException } from "#/models/core/types";
import { Exception } from "#/models/exceptions";
import { logFatalErrorInSentry, logWarningInSentry } from "#/utils/sentry";

export const getFondationFromSlugFn = createServerFn()
  .validator(z.object({ slug: z.string(), page: z.number().default(1) }))
  .handler(async ({ data: { slug, page } }) => {
    try {
      return await getFondationFromSlug(slug, {
        page,
      });
    } catch (e) {
      handleException(e, slug);
    }
  });

function handleException(e: unknown, slug: string): never {
  if (e instanceof NotAnIdRnfError || e instanceof HttpNotFound) {
    logWarningInSentry(
      new Exception({
        name: "PageNotFoundException",
        cause: e,
        context: { slug },
      })
    );
    throw notFound();
  }
  if (e instanceof IdRnfNotFoundError) {
    logWarningInSentry(
      new Exception({
        name: "IdRnfNotFound",
        cause: e,
        context: { slug },
      })
    );
    throw redirect({ to: "/erreur/introuvable/$slug", params: { slug } });
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
