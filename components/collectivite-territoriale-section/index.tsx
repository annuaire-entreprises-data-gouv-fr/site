import type React from "react";
import { Link } from "#components/Link";
import { Section } from "#components/section";
import { TwoColumnTable } from "#components/table/simple";
import FAQLink from "#components-ui/faq-link";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ICollectiviteTerritoriale } from "#models/core/types";

const CollectiviteTerritorialeSection: React.FC<{
  uniteLegale: ICollectiviteTerritoriale;
}> = ({ uniteLegale }) => {
  const {
    colter: { codeColter = "", codeInsee = "", elus = [], niveau = "" },
  } = uniteLegale;

  const data = [
    [
      <FAQLink
        to="https://www.insee.fr/fr/information/2560452"
        tooltipLabel="Code Insee"
      >
        Le Code Insee ou Code Officiel Géographique (COG) est utilisé par
        l’Insee pour désigner une commune
      </FAQLink>,
      codeInsee,
    ],
    [
      "Type",
      niveau === "particulier" ? (
        <FAQLink
          to="https://www.insee.fr/fr/information/3528272"
          tooltipLabel={niveau}
        >
          {uniteLegale.nomComplet} est une collectivité territoriale à statut
          particulier
        </FAQLink>
      ) : (
        niveau
      ),
    ],
    [
      "Élus",
      elus.length > 0 ? (
        <Link href={`/dirigeants/${uniteLegale.siren}`}>
          → voir les {elus.length} élu(s)
        </Link>
      ) : (
        ""
      ),
    ],
  ];

  const shouldDisplayCollectiviteLink = codeInsee && niveau === "commune";
  return (
    <>
      <Section
        sources={[
          EAdministration.INSEE,
          EAdministration.MI,
          EAdministration.DINUM,
        ]}
        title={"Collectivité territoriale"}
      >
        <TwoColumnTable body={data} />
        {shouldDisplayCollectiviteLink && (
          <>
            <br />
            Retrouvez plus d&apos;informations sur la{" "}
            <a
              href={`https://collectivite.fr/${codeInsee}`}
              rel="noopener"
              target="_blank"
            >
              fiche collectivites.fr
            </a>
            .
          </>
        )}
      </Section>
    </>
  );
};

export default CollectiviteTerritorialeSection;
