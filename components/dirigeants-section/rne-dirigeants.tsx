import React from 'react';
import routes from '#clients/routes';
import InpiPartiallyDownWarning from '#components-ui/alerts-with-explanations/inpi-partially-down';
import { INPI } from '#components/administrations';
import { DataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { UniteLegalePageLink } from '#components/unite-legale-page-link';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPILoading } from '#models/api-loading';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import {
  IEtatCivil,
  IImmatriculationRNE,
  IPersonneMorale,
} from '#models/immatriculation';
import { formatDatePartial, formatIntFr } from '#utils/helpers';

/**
 * Weird bug happennig here. Webpack build fail when this function is in model/dirigeants.ts
 * @param toBeDetermined
 * @returns
 */
export const isPersonneMorale = (
  toBeDetermined: IEtatCivil | IPersonneMorale
): toBeDetermined is IPersonneMorale => {
  if (
    (toBeDetermined as IPersonneMorale).siren ||
    (toBeDetermined as IPersonneMorale).denomination
  ) {
    return true;
  }
  return false;
};

type IProps = {
  immatriculationRNE:
    | IImmatriculationRNE
    | IAPINotRespondingError
    | IAPILoading;
  uniteLegale: IUniteLegale;
};

/**
 * Dirigeants section
 */
const DirigeantsSection: React.FC<IProps> = ({
  immatriculationRNE,
  uniteLegale,
}) => (
  <DataSectionClient
    id="rne-dirigeants"
    title="Dirigeant(s)"
    sources={[EAdministration.INPI]}
    data={immatriculationRNE}
    notFoundInfo={
      <>
        Cette structure n’est pas enregistrée au{' '}
        <strong>Registre National des Entreprises (RNE)</strong>
      </>
    }
  >
    {(immatriculationRNE) => (
      <DirigeantContent
        immatriculationRNE={immatriculationRNE}
        uniteLegale={uniteLegale}
      />
    )}
  </DataSectionClient>
);

export default DirigeantsSection;

type IDirigeantContentProps = {
  immatriculationRNE: IImmatriculationRNE;
  uniteLegale: IUniteLegale;
};
function DirigeantContent({
  immatriculationRNE,
  uniteLegale,
}: IDirigeantContentProps) {
  const { dirigeants } = immatriculationRNE;

  const formatDirigeant = (dirigeant: IEtatCivil | IPersonneMorale) => {
    if (isPersonneMorale(dirigeant)) {
      const infos = [
        dirigeant.role,
        <>
          <strong>{dirigeant.denomination}</strong>
          {dirigeant.siren ? (
            <>
              {' - '}
              <a href={`/entreprise/${dirigeant.siren}`}>
                {formatIntFr(dirigeant.siren)}
              </a>
            </>
          ) : (
            ''
          )}
          <br />
          {dirigeant.natureJuridique}
        </>,
      ];

      if (dirigeant.siren) {
        const defaultDenom = dirigeant.denomination || dirigeant.siren;
        //@ts-ignore
        infos.push([
          <a href={`/dirigeants/${dirigeant.siren}`}>
            → voir les dirigeants de {defaultDenom}
          </a>,
        ]);
      }
      return infos;
    } else {
      const nomComplet = `${dirigeant.prenom || ''}${
        dirigeant.prenom && dirigeant.nom ? ' ' : ''
      }${(dirigeant.nom || '').toUpperCase()}`;

      const firstName = (dirigeant.prenom || '').split(',')[0];

      return [
        dirigeant.role,
        <>
          {nomComplet}
          {dirigeant.dateNaissancePartial
            ? `, né(e) en ${formatDatePartial(dirigeant.dateNaissancePartial)}`
            : ''}
        </>,
        ...(dirigeant.dateNaissancePartial
          ? [
              <a
                href={`/personne?n=${dirigeant.nom}&fn=${firstName}&partialDate=${dirigeant.dateNaissancePartial}&sirenFrom=${uniteLegale.siren}`}
              >
                → voir ses entreprises
              </a>,
            ]
          : []),
      ];
    }
  };

  const plural = hasSeveralDirigeants(immatriculationRNE) ? 's' : '';
  return (
    <>
      {immatriculationRNE.metadata.isFallback &&
        immatriculationRNE.dirigeants.length > 0 && (
          <InpiPartiallyDownWarning />
        )}
      {dirigeants.length === 0 ? (
        <p>
          Cette entreprise est enregistrée au{' '}
          <strong>Registre National des Entreprises (RNE)</strong>, mais n’y
          possède aucun dirigeant.
        </p>
      ) : (
        <>
          <p>
            Cette entreprise possède {dirigeants.length} dirigeant{plural}{' '}
            enregistré{plural} au{' '}
            <strong>Registre National des Entreprises (RNE)</strong> tenu par l’
            <INPI />. Pour en savoir plus, vous pouvez consulter{' '}
            <UniteLegalePageLink
              href={`${routes.rne.portail.entreprise}${uniteLegale.siren}`}
              uniteLegale={uniteLegale}
              siteName="le site de l’INPI"
            />
            &nbsp;:
          </p>
          <FullTable
            head={['Role', 'Details', 'Action']}
            body={dirigeants.map((dirigeant) => formatDirigeant(dirigeant))}
          />
        </>
      )}
    </>
  );
}

function hasSeveralDirigeants(immatriculationRNE: IImmatriculationRNE) {
  return immatriculationRNE.dirigeants.length > 1;
}
