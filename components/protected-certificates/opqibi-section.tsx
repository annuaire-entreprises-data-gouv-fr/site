import { getOpqibiFetcher } from "server-fetch/agent";
import { AsyncDataSectionServer } from "#components/section/data-section/server";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { OpqibiContent } from "./opqibi-content";

export const OpqibiSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const data = getOpqibiFetcher(uniteLegale.siren, session);

  return (
    <AsyncDataSectionServer
      ContentComponent={OpqibiContent}
      data={data}
      id="opqibi"
      isProtected
      notFoundInfo={
        <>
          Cette entreprise n’a pas de{" "}
          <a
            aria-label="En savoir plus sur les certificats Opqibi, nouvelle fenêtre"
            href="https://www.opqibi.com/page/la-qualification-opqibi"
            rel="noreferrer"
            target="_blank"
          >
            certificat Opqibi
          </a>
          .
        </>
      }
      otherContentProps={{}}
      sources={[EAdministration.OPQIBI]}
      title="Certificat OPQIBI"
    />
  );
};
