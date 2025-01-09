'use client';

import FAQLink from '#components-ui/faq-link';
import { Icon } from '#components-ui/icon/wrapper';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IDocumentDownloader } from '#models/espace-agent/travaux-publics';
import { UseCase } from '#models/user/agent';
import { ISession } from '#models/user/session';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { useMemo } from 'react';

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
    } else {
      return (
        <Icon slug="errorFill" color="#df0a00">
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
  }
  return (
    <div className="layout-space-between">
      <Icon slug="open">
        {administration ? `${administration} : ` : ''}document disponible
      </Icon>
      {data.url && (
        <a href={data.url}>
          <Icon slug="download">{'télécharger'}</Icon>
        </a>
      )}
    </div>
  );
};

export default function TravauxPublicsSectionWithUseCase({
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
      title={title}
      id={id}
      isProtected={isProtected}
      sources={sources}
      data={travauxPublics}
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
                <DocumentDownloader data={data.fntp} administration="FNTP" />,
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
                      data={data.cnetp}
                      administration="CNETP"
                    />
                  </div>
                  <div>
                    <DocumentDownloader
                      data={data.cnetp}
                      administration="CIBTP"
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
                  data={data.probtp}
                  administration="ProBTP"
                />,
              ],
            ]}
          />
        </>
      )}
    </AsyncDataSectionClient>
  );
}
