"use client";

import { APIRoutesPaths } from "app/api/data-fetching/routes-paths";
import { useAPIRouteData } from "hooks/fetch/use-API-route-data";
import { useMemo } from "react";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { TwoColumnTable } from "#components/table/simple";
import FAQLink from "#components-ui/faq-link";
import { Icon } from "#components-ui/icon/wrapper";
import type { EAdministration } from "#models/administrations/EAdministration";
import {
  type IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from "#models/api-not-responding";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import type { IDocumentDownloader } from "#models/espace-agent/travaux-publics";
import type { UseCase } from "#models/use-cases";

const DocumentDownloader = ({
  data,
  administration,
}: {
  data: IDocumentDownloader | IAPINotRespondingError;
  administration: string;
}) => {
  if (isAPINotResponding(data)) {
    if (isAPI404(data)) {
      return (
        <Icon slug="closed">{administration} : document introuvable.</Icon>
      );
    }
    return (
      <Icon color="#df0a00" slug="errorFill">
        La récupération du document auprès des services {administration} a
        échoué.
        <br />
        Ré-essayez plus tard ou rapprochez-vous de l’entreprise pour lui
        demander la pièce directement.
        <br />
        <br />
      </Icon>
    );
  }
  return (
    <div className="layout-space-between">
      <Icon slug="open">
        {administration ? `${administration} : ` : ""}document disponible
      </Icon>
      {data.url && (
        <a href={data.url}>
          <Icon slug="download">{"télécharger"}</Icon>
        </a>
      )}
    </div>
  );
};

export default function ProtectedTravauxPublicsSection({
  uniteLegale,
  session,
  useCase,
  title,
  id,
  sources,
  isProtected,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
  useCase: UseCase;
  title: string;
  id: string;
  sources: EAdministration[];
  isProtected: boolean;
}) {
  const params = useMemo(
    () => ({
      params: { useCase },
    }),
    [useCase]
  );
  const travauxPublics = useAPIRouteData(
    APIRoutesPaths.EspaceAgentTravauxPublics,
    uniteLegale.siege.siret,
    session,
    params
  );

  return (
    <AsyncDataSectionClient
      data={travauxPublics}
      id={id}
      isProtected={isProtected}
      sources={sources}
      title={title}
    >
      {(data) => (
        <>
          <TwoColumnTable
            body={[
              [
                <FAQLink tooltipLabel="Carte de travaux publics ">
                  Carte professionnelle d’entrepreneur de travaux publics,
                  délivrée par la Fédération Nationale des Travaux Publics
                  (FNTP) à une entreprise en règle de ses obligations sociales,
                  administratives et juridiques.
                </FAQLink>,
                <DocumentDownloader administration="FNTP" data={data.fntp} />,
              ],
              [
                <FAQLink tooltipLabel="Cotisations congés & chômage">
                  Certificat indiquant qu’une entreprise de travaux publics
                  affiliée à la caisse CNETP ou CIBTP est en règle de ses
                  cotisations congés payés et chômage-intempéries.
                </FAQLink>,
                <>
                  <div>
                    <DocumentDownloader
                      administration="CNETP"
                      data={data.cnetp}
                    />
                  </div>
                  <div>
                    <DocumentDownloader
                      administration="CIBTP"
                      data={data.cnetp}
                    />
                  </div>
                </>,
              ],
              [
                <FAQLink tooltipLabel="Cotisations retraite">
                  Document indiquant la régularité des cotisations de retraite
                  complémentaire auprès de la Protection Sociale du Bâtiment et
                  des Travaux publics (ProBTP).
                </FAQLink>,
                <DocumentDownloader
                  administration="ProBTP"
                  data={data.probtp}
                />,
              ],
            ]}
          />
        </>
      )}
    </AsyncDataSectionClient>
  );
}
