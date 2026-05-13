import { createFileRoute } from "@tanstack/react-router";
import AdministrationDescription from "#/components/administrations/administration-description";
import TextWrapper from "#/components-ui/text-wrapper";
import { administrationsMetaData } from "#/models/administrations";
import { meta } from "#/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/administration/")({
  head: () => {
    const canonical =
      "https://annuaire-entreprises.data.gouv.fr/administration";
    return {
      meta: meta({
        title:
          "Liste des administrations partenaires de l’Annuaire des Entreprises",
      }),
      links: [
        {
          rel: "canonical",
          href: canonical,
        },
      ],
    };
  },
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  return (
    <TextWrapper>
      <h1>Administrations partenaires</h1>
      <p>
        L’Annuaire des Entreprises est conçu en partenariat avec{" "}
        {Object.values(administrationsMetaData).length} administrations
        différentes, qui nous transmettent les données qu’elles possèdent sur
        les entreprises, les associations ou les services publics&nbsp;:
      </p>
      {Object.values(administrationsMetaData).map(({ slug }) => (
        <AdministrationDescription key={slug} slug={slug} />
      ))}
    </TextWrapper>
  );
}
