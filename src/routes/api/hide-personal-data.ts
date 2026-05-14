import { createFileRoute } from "@tanstack/react-router";
import { getRequestHeader } from "@tanstack/react-start/server";
import {
  isEntrepreneurIndividuel,
  SirenNotFoundError,
} from "#/models/core/types";
import { getUniteLegaleFromSlug } from "#/models/core/unite-legale";
import { Exception } from "#/models/exceptions";
import { requestSirenProtection } from "#/models/protected-siren/request-siren-protection";
import { hasSirenFormat } from "#/utils/helpers";
import logErrorInSentry from "#/utils/sentry";
import getSession from "#/utils/server-side-helper/get-session";
import { getHidePersonalDataRequestFCSession } from "#/utils/session";
import isUserAgentABot from "#/utils/user-agent";

class HidePersonalDataFailedException extends Exception {
  constructor(args: { cause?: unknown }) {
    super({
      ...args,
      name: "LogoutFailedException",
    });
  }
}

export const Route = createFileRoute("/api/hide-personal-data")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formData = await request.formData();
          const siren = formData.get("siren");
          if (typeof siren !== "string" || !hasSirenFormat(siren)) {
            return Response.json(
              { message: "Le SIREN est invalide." },
              { status: 400 }
            );
          }

          const userAgent = getRequestHeader("user-agent") || "";
          const isBot = isUserAgentABot(userAgent);

          const uniteLegale = await getUniteLegaleFromSlug(siren, {
            isBot,
          });

          if (isEntrepreneurIndividuel(uniteLegale)) {
            return Response.json({ uniteLegale });
          }

          const franceConnect = getHidePersonalDataRequestFCSession(
            await getSession()
          );

          if (!franceConnect) {
            return Response.json(
              { error: "La session France Connect est invalide." },
              { status: 401 }
            );
          }

          const hidePersonalDataRequest = await requestSirenProtection(
            siren,
            franceConnect.firstName,
            franceConnect.familyName,
            franceConnect.birthdate,
            franceConnect.sub
          );

          return Response.json({
            hidePersonalDataRequest,
            uniteLegale,
          });
        } catch (error) {
          let message = "";
          if (error instanceof SirenNotFoundError) {
            message =
              "Le SIREN est valide mais l'entreprise correspondante n'a pas été trouvée.";
          } else {
            logErrorInSentry(
              new HidePersonalDataFailedException({ cause: error })
            );
          }

          return Response.json(
            {
              message:
                message ||
                "Une erreur est intervenue. Nos équipes ont été notifiés.",
            },
            { status: message ? 400 : 500 }
          );
        }
      },
    },
  },
});
