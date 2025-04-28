'use client';

import { Tag } from '#components-ui/tag';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import {
  formatDate,
  formatSiret,
  uniteLegaleLabelWithPronounContracted,
} from '#utils/helpers';
import { useFetchAlimConfiance } from 'hooks/fetch/alim-confiance';

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

/**
 * Alim‘Confiance section
 */
export default function AlimConfianceSection({ uniteLegale }: IProps) {
  const alimConfiance = useFetchAlimConfiance(uniteLegale);

  return (
    <AsyncDataSectionClient
      id="dpo-section"
      title="Dispositif d'information Alim’confiance"
      sources={[EAdministration.MAA]}
      isProtected={false}
      data={alimConfiance}
      notFoundInfo={null}
    >
      {(alimConfiance) => {
        return (
          <>
            <div>
              <p>
                Vous trouverez ci-dessous les résultats des dernières
                inspections sanitaires réalisées dans les établissements{' '}
                {uniteLegaleLabelWithPronounContracted(uniteLegale)}.
              </p>

              <FullTable
                head={[
                  "Détail de l'établissement",
                  "Résultat de l'évaluation",
                  "Date d'inspection",
                  "Type d'activité",
                ]}
                columnWidths={['40%', '20%', '25%', '15%']}
                body={alimConfiance.map(
                  ({
                    siret,
                    denomination,
                    adresse,
                    codePostal,
                    commune,
                    libelleActiviteEtablissement,
                    dateInspection,
                    syntheseEvaluation,
                    code,
                  }) => [
                    <>
                      {siret && (
                        <a href={`/etablissement/${siret}`}>
                          {formatSiret(siret)}
                        </a>
                      )}
                      {denomination && <div>{denomination}</div>}
                      {adresse && codePostal && commune && (
                        <div>
                          {adresse} {codePostal} {commune}
                        </div>
                      )}
                    </>,
                    <Tag
                      color={
                        code === '4'
                          ? 'error'
                          : code === '3'
                          ? 'warning'
                          : 'success'
                      }
                    >
                      {syntheseEvaluation}
                    </Tag>,
                    <div>{formatDate(dateInspection)}</div>,
                    <div>
                      {libelleActiviteEtablissement.split('|').join(', ')}
                    </div>,
                  ]
                )}
              />
            </div>
          </>
        );
      }}
    </AsyncDataSectionClient>
  );
}
