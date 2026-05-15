import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import HidePersonalDataPageClient from "#/components/screens/formulaire.supprimer-donnees-personnelles-entreprise";
import TextWrapper from "#/components-ui/text-wrapper";
import { meta } from "#/utils/seo";
import {
  getCurrentSession,
  getHidePersonalDataRequestFCSession,
} from "#/utils/session";
import { HeaderDefaultError } from "./-error";

const fetchHidePersonalDataRequestFn = createServerFn().handler(async () => {
  const session = await getCurrentSession();

  const franceConnectInfo = getHidePersonalDataRequestFCSession(session.data);

  return franceConnectInfo
    ? {
        franceConnectInfo: {
          firstName: franceConnectInfo.firstName,
          familyName: franceConnectInfo.familyName,
          birthdate: franceConnectInfo.birthdate,
        },
        hasInvalidFCSession: false,
      }
    : {
        franceConnectInfo: null,
        hasInvalidFCSession:
          !!session.data.franceConnectHidePersonalDataSession,
      };
});

export const Route = createFileRoute(
  "/_header-default/formulaire/supprimer-donnees-personnelles-entreprise"
)({
  loader: async () => await fetchHidePersonalDataRequestFn(),
  head: () => ({
    meta: meta({
      title: "Demande de suppression de données personnelles",
      description:
        "Demande de suppression de données personnelles de dirigeant d’entreprise sur l’Annuaire des Entreprises",
      robots: "index, follow",
    }),
  }),
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  const { franceConnectInfo, hasInvalidFCSession } = Route.useLoaderData();

  return (
    <TextWrapper>
      <h1>Demande de suppression de données personnelles</h1>
      <HidePersonalDataPageClient
        franceConnectInfo={franceConnectInfo}
        hasInvalidFCSession={hasInvalidFCSession}
      />
    </TextWrapper>
  );
}
