import { createFileRoute } from "@tanstack/react-router";
import AdministrationDescription from "#/components/administrations/administration-description";
import TextWrapper from "#/components-ui/text-wrapper";
import { administrationsMetaData } from "#/models/administrations";
import { meta } from "#/utils/seo";
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
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Object.values(administrationsMetaData).map(({ slug }) => (
          <li key={slug}>
            <AdministrationDescription slug={slug} />
          </li>
        ))}
      </ul>
    </TextWrapper>
  );
}
