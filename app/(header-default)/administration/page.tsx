import TextWrapper from "#components-ui/text-wrapper";
import AdministrationDescription from "#components/administrations/administration-description";
import { administrationsMetaData } from "#models/administrations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liste des administrations partenaires de l’Annuaire des Entreprises",
  alternates: {
    canonical: "https://annuaire-entreprises.data.gouv.fr/administration",
  },
};

const AllAdministrationsPage = () => (
  <TextWrapper>
    <h1>Administrations partenaires</h1>
    <p>
      L’Annuaire des Entreprises est conçu en partenariat avec{" "}
      {Object.values(administrationsMetaData).length} administrations
      différentes, qui nous transmettent les données qu’elles possèdent sur les
      entreprises, les associations ou les services publics&nbsp;:
    </p>
    {Object.values(administrationsMetaData).map(({ slug }) => (
      <AdministrationDescription slug={slug} key={slug} />
    ))}
  </TextWrapper>
);

export default AllAdministrationsPage;
