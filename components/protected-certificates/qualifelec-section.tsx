import { getQualifelecFetcher } from "server-fetch/agent";
import { AsyncDataSectionServer } from "#components/section/data-section/server";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IUniteLegale } from "#models/core/types";
import { QualifelecContent } from "./qualifelec-content";

export function QualifelecSection({
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
}) {
  const qualifelec = getQualifelecFetcher(uniteLegale.siege.siret);

  return (
    <AsyncDataSectionServer
      ContentComponent={QualifelecContent}
      data={qualifelec}
      id="qualifelec"
      isProtected
      notFoundInfo={
        <>
          Cette entreprise n’a pas de{" "}
          <a
            aria-label="En savoir plus sur les certificats Qualifelec, nouvelle fenêtre"
            href="https://www.qualifelec.fr/pourquoi-choisir-une-entreprise-qualifelec/le-certificat-qualifelec-la-meilleure-des-recommandations/"
            rel="noreferrer"
            target="_blank"
          >
            certificat Qualifelec
          </a>
          .
        </>
      }
      otherContentProps={{}}
      sources={[EAdministration.QUALIFELEC]}
      title="Certificats Qualifelec"
    />
  );
}
