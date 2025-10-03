import { clientDocuments } from "#clients/api-rne/documents";
import { HttpNotFound } from "#clients/exceptions";
import { EAdministration } from "#models/administrations/EAdministration";
import { APINotRespondingFactory } from "#models/api-not-responding";
import { verifySiren } from "#utils/helpers";

export async function getDocumentsRNEProtected(maybeSiren: string) {
  const siren = verifySiren(maybeSiren);

  try {
    const actes = await clientDocuments(siren);
    return actes;
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    }

    // no need to log an error as API-Proxy already logged it
    return APINotRespondingFactory(EAdministration.INPI, 500);
  }
}
