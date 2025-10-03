import TextWrapper from "#components-ui/text-wrapper";
import { allDataToModify } from "#models/administrations/data-to-modify";
import { Metadata } from "next";

export default function FAQPage() {
  return (
    <TextWrapper>
      <h1>Comment modifier les informations d’une entreprise ?</h1>
      Quelle information souhaitez vous modifier :
      <ul>
        {allDataToModify.map(({ label, slug }) => (
          <li key={slug}>
            <a href={`/faq/modifier/${slug}`}>{label}</a>
          </li>
        ))}
      </ul>
    </TextWrapper>
  );
}

export const metadata: Metadata = {
  title:
    "FAQ : modifier une information présente sur l’Annuaire des Entreprises",
  alternates: {
    canonical: "https://annuaire-entreprises.data.gouv.fr/faq/modifier",
  },
  robots: "index, follow",
};
