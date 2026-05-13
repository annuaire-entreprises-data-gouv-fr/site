import { redirect } from "@tanstack/react-router";
import {
  extractSirenOrSiretFromRechercherUrl,
  isLikelyASiren,
  isLikelyASiret,
} from "#/utils/helpers";

export function beforeLoadCheckTerme(searchTerm: string | undefined) {
  if (!searchTerm) {
    return;
  }

  const sirenOrSiretParam = extractSirenOrSiretFromRechercherUrl(searchTerm);

  if (isLikelyASiret(sirenOrSiretParam)) {
    throw redirect({
      to: "/etablissement/$slug",
      params: { slug: sirenOrSiretParam },
      search: {
        redirected: "1",
      },
    });
  }
  if (isLikelyASiren(sirenOrSiretParam)) {
    throw redirect({
      to: "/entreprise/$slug",
      params: { slug: sirenOrSiretParam },
      search: {
        redirected: "1",
      },
    });
  }
}
