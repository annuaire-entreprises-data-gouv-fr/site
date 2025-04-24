'use client';

import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import { formatDate } from '#utils/helpers';
import { useFetchAlimConfiance } from 'hooks/fetch/alim-confiance';

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

const AlimConfianceNotFound = () => (
  <p>
    Aucune donnée issue d‘une inspection sanitaire réalisée dans cet
    établissement n‘a été trouvée.
  </p>
);

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
      notFoundInfo={<AlimConfianceNotFound />}
    >
      {(alimConfiance) => {
        return (
          <div>
            <p>
              Vous trouverez ci-dessous les résultats de la dernière inspection
              sanitaire réalisée dans cet établissement le{' '}
              {formatDate(alimConfiance.dateInspection)}.
            </p>

            <TwoColumnTable
              body={[
                ["Résultat de l'évaluation", alimConfiance.syntheseEvaluation],
                ["Type d'activité", alimConfiance.libelleActiviteEtablissement],
                ["Date d'inspection", formatDate(alimConfiance.dateInspection)],
              ]}
            />
          </div>
        );
      }}
    </AsyncDataSectionClient>
  );
}
