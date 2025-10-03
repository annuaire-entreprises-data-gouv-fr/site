import type React from "react";
import { MarcheInclusion } from "#components/administrations";
import { DataSection } from "#components/section/data-section";
import { FullTable } from "#components/table/full";
import ButtonLink from "#components-ui/button";
import FAQLink from "#components-ui/faq-link";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ICertifications } from "#models/certifications";
import { formatSiret } from "#utils/helpers";

export const EntrepriseInclusiveSection: React.FC<{
  entrepriseInclusive: ICertifications["entrepriseInclusive"];
}> = ({ entrepriseInclusive }) => (
  <DataSection
    data={entrepriseInclusive}
    id="entreprise-inclusive"
    notFoundInfo={
      <p>Nous n’avons pas retrouvé les informations de cette structure.</p>
    }
    sources={[EAdministration.MARCHE_INCLUSION]}
    title="Entreprise Sociale Inclusive"
  >
    {(entrepriseInclusive) => (
      <>
        Cette structure est une{" "}
        <FAQLink tooltipLabel="Entreprise Sociale Inclusive">
          Une Entreprise Sociale Inclusive ou ESI, est une entreprise qui agit
          pour l’insertion sociale et professionnelle des personnes les plus
          éloignées de l’emploi.
        </FAQLink>
        .
        <p>
          Elle possède {entrepriseInclusive.length} établissement(s)
          enregistré(s) sur le <MarcheInclusion /> :
        </p>
        <FullTable
          body={entrepriseInclusive.map(
            ({
              siret,
              marcheInclusionLink,
              type,
              category,
              city,
              department,
            }) => [
              <a href={`/etablissement/${siret}`}>{formatSiret(siret)}</a>,
              category,
              type,
              <>
                {city}
                {department ? ` (${department})` : ""}
              </>,
              <ButtonLink alt small to={marcheInclusionLink}>
                ⇢&nbsp;Consulter
              </ButtonLink>,
            ]
          )}
          head={[
            "Siret de l’établissement",
            "Catégorie",
            "Type de structure",
            "Lieu",
            "Plus d’informations",
          ]}
        />
      </>
    )}
  </DataSection>
);
