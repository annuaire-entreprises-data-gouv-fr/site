import type { Metadata } from "next";
import { Link } from "#components/Link";
import TextWrapper from "#components-ui/text-wrapper";
import { allDataToModify } from "#models/administrations/data-to-modify";

export default function FAQPage() {
  return (
    <TextWrapper>
      <h1>Comment modifier les informations d’une entreprise ?</h1>
      Quelle information souhaitez vous modifier :
      <ul>
        {allDataToModify.map(({ label, slug }) => (
          <li key={slug}>
            <Link href={`/faq/modifier/${slug}`}>{label}</Link>
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
