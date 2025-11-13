import { getQualibatFetcher } from "server-fetch/agent";
import { AsyncDataSectionServer } from "#components/section/data-section/server";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { QualibatContent } from "./qualibat-content";

export const QualibatSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const qualibat = getQualibatFetcher(uniteLegale.siege.siret, session);
  return (
    <AsyncDataSectionServer
      ContentComponent={QualibatContent}
      data={qualibat}
      id="qualibat"
      isProtected
      notFoundInfo={
        <>
          Cette entreprise n’a pas de{" "}
          <a
            aria-label="En savoir plus sur les certificats Qualibat, nouvelle fenêtre"
            href="https://www.qualibat.com/qualification-des-competences/"
            rel="noreferrer"
            target="_blank"
          >
            certificat Qualibat
          </a>
          .
        </>
      }
      otherContentProps={{}}
      sources={[EAdministration.QUALIBAT]}
      title="Certificat Qualibat"
    />
  );
};
