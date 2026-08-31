import { wrapFetchWithSentry } from "@sentry/tanstackstart-react";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

const legacyEntrepriseTabPathPattern =
  /^\/(annonces|dirigeants|divers|documents|donnees-financieres|effectifs|etablissements-scolaires|labels-certificats)\/([^/]+)\/?$/;

const redirectLegacyEntrepriseTab = (request: Request) => {
  const destination = new URL(request.url);
  const match = destination.pathname.match(legacyEntrepriseTabPathPattern);

  if (!match) {
    return null;
  }

  const [, tabPath, slug] = match;
  destination.pathname = `/entreprise/${slug}/${tabPath}`;

  return Response.redirect(destination, 308);
};

if (
  import.meta.env.DEV &&
  process.env.NODE_ENV !== "production" &&
  process.env.VITE_END2END_MOCKING === "enabled" &&
  process.env.BUILD_PHASE !== "true"
) {
  import("#/e2e-mock/mocks/server");
}

export default createServerEntry(
  wrapFetchWithSentry({
    fetch(request: Request) {
      return redirectLegacyEntrepriseTab(request) ?? handler.fetch(request);
    },
  })
);
