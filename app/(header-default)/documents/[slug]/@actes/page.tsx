import routes from '#clients/routes';
import { Warning } from '#components-ui/alerts';
import ButtonLink from '#components-ui/button';
import ShowMore from '#components-ui/show-more';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { isAssociation, isServicePublic } from '#models/core/types';
import { IActesRNE } from '#models/immatriculation';
import { getDocumentsRNEProtected } from '#models/immatriculation/rne';
import { formatDateLong } from '#utils/helpers';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import { sectionInfo } from './common';

const NoDocument = () => (
  <>Aucun document n’a été retrouvé dans le RNE pour cette entreprise.</>
);

export default async function AgentActesSection(props: AppRouterProps) {
  const { slug, isBot } = extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);
  const documents = await getDocumentsRNEProtected(uniteLegale.siren);

  return (
    <DataSection
      {...sectionInfo}
      data={documents}
      notFoundInfo={
        <>
          {(isAssociation(uniteLegale) || isServicePublic(uniteLegale)) && (
            <>
              <Warning full>
                Les associations et les services publics ne sont pas
                immatriculés au RNE.
              </Warning>
              <br />
            </>
          )}
          <NoDocument />
        </>
      }
    >
      {(documents) => (
        <>
          <p>
            Cette entreprise possède {documents.actes.length} document(s) au
            RNE. Chaque document peut contenir un ou plusieurs actes :
          </p>
          {documents.actes.length >= 5 ? (
            <ShowMore
              label={`Voir les ${
                documents.actes.length - 5
              } documents supplémentaires`}
            >
              <ActesTable actes={documents.actes} />
            </ShowMore>
          ) : (
            <ActesTable actes={documents.actes} />
          )}
        </>
      )}
    </DataSection>
  );
}

type IActesTableProps = {
  actes: IActesRNE['actes'];
};
function ActesTable({ actes }: IActesTableProps) {
  return (
    <FullTable
      head={['Date de dépôt', 'Acte(s) contenu(s)', 'Lien']}
      body={actes.map((a) => [
        formatDateLong(a.dateDepot),
        a.actes && (
          <ul>
            {(a?.actes || []).map((acteName) => (
              <li key={acteName}>{acteName}</li>
            ))}
          </ul>
        ),
        <ButtonLink
          target="_blank"
          alt
          small
          to={`${routes.api.rne.documents.download}${a.id}?type=acte`}
        >
          Télécharger
        </ButtonLink>,
      ])}
    />
  );
}
