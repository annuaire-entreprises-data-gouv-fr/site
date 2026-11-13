import { createFileRoute } from "@tanstack/react-router";
import HidePersonalDataPage from "#/components/screens/formulaire.supprimer-donnees-personnelles-entreprise";
import Breadcrumb from "#/components-ui/breadcrumb";
import TextWrapper from "#/components-ui/text-wrapper";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "./-error";

const TITLE = "Comment supprimer les données personnelles de mon entreprise ?";

export const Route = createFileRoute(
  "/_header-default/formulaire/supprimer-donnees-personnelles-entreprise"
)({
  head: () => ({
    meta: meta({
      title: TITLE,
      description:
        "Demande de suppression de données personnelles de dirigeant d’entreprise sur l’Annuaire des Entreprises",
      robots: "index, follow",
    }),
  }),
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  return (
    <TextWrapper>
      <Breadcrumb
        links={[
          { to: "/faq", label: "Questions fréquentes" },
          { to: ".", label: TITLE },
        ]}
      />
      <h1>{TITLE}</h1>
      <HidePersonalDataPage />
    </TextWrapper>
  );
}
