import { useMemo } from "react";
import { AsyncDataSectionClient } from "#/components/section/data-section/client";
import { TwoColumnTable } from "#/components/table/simple";
import FAQLink from "#/components-ui/faq-link";
import { Icon } from "#/components-ui/icon/wrapper";
import { useServerFnData } from "#/hooks/fetch/use-server-fn-data";
import type { EAdministration } from "#/models/administrations/EAdministration";
import {
  type IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from "#/models/api-not-responding";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import type { IDocumentDownloader } from "#/models/espace-agent/travaux-publics";
import type { UseCase } from "#/models/use-cases";
import { getAgentTravauxPublicsFn } from "#/server-functions/agent/data-fetching";

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
  useCase,
  title,
  id,
  sources,
  isProtected,
}: {
  uniteLegale: IUniteLegale;
  useCase: UseCase;
  title: string;
  id: string;
  sources: EAdministration[];
  isProtected: boolean;
}) {
  const input = useMemo(
    () => ({ siret: uniteLegale.siege.siret, useCase }),
    [uniteLegale.siege.siret, useCase]
  );
  const travauxPublics = useServerFnData(
    getAgentTravauxPublicsFn,
    input,
    ApplicationRights.travauxPublics
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
