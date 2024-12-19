'use client';

import FAQLink from '#components-ui/faq-link';
import { Icon } from '#components-ui/icon/wrapper';
import { Tag } from '#components-ui/tag';
import IsActiveTag from '#components-ui/tag/is-active-tag';
import { NonDiffusibleTag } from '#components-ui/tag/non-diffusible-tag';
import { FullTable } from '#components/table/full';
import { estDiffusible, estNonDiffusibleStrict } from '#models/core/diffusion';
import { estActif } from '#models/core/etat-administratif';
import { IEtablissement, IUniteLegale } from '#models/core/types';
import {
  formatDate,
  formatSiret,
  uniteLegaleLabelWithPronounContracted,
} from '#utils/helpers';
import { useEffect, useState } from 'react';

export const EtablissementsTable: React.FC<{
  etablissements: IEtablissement[];
  uniteLegale: IUniteLegale;
}> = ({ etablissements, uniteLegale }) => {
  const [orderedEtablissmentList, setOrderedList] = useState<IEtablissement[]>(
    []
  );
  useEffect(() => {
    const list = etablissements;
    list.sort((e) => (estActif(e) ? -1 : 1)).sort((e) => (e.estSiege ? -1 : 1));

    setOrderedList(list);
  });

  return (
    <FullTable
      head={['Établissement (siret, adresse, activité)', 'Création', 'État']}
      body={orderedEtablissmentList.map((etablissement: IEtablissement) => [
        <>
          <div>
            <a href="#">{formatSiret(etablissement.siret)}</a>
            {etablissement.estSiege ? (
              <Tag color="info">siège social</Tag>
            ) : etablissement.ancienSiege ? (
              <Tag>ancien siège social</Tag>
            ) : null}
            {!estDiffusible(etablissement) && (
              <NonDiffusibleTag etablissementOrUniteLegale={etablissement} />
            )}
          </div>
          {!estNonDiffusibleStrict(etablissement) ? (
            <>
              {etablissement.activitePrincipale !==
              uniteLegale.activitePrincipale ? (
                <div>
                  <FAQLink tooltipLabel={<strong>Activité différente</strong>}>
                    Cet établissement a une activité différente de l’activité
                    principale{' '}
                    {uniteLegaleLabelWithPronounContracted(uniteLegale)}{' '}
                    {uniteLegale.nomComplet}, qui est{' '}
                    <i>
                      {uniteLegale.libelleActivitePrincipale} (
                      {uniteLegale.activitePrincipale})
                    </i>
                  </FAQLink>
                  {' : '}
                  {etablissement.libelleActivitePrincipale}
                </div>
              ) : null}
              <Icon slug="mapPin">{etablissement.adressePostale}</Icon>
            </>
          ) : null}
        </>,
        (!estNonDiffusibleStrict(etablissement) &&
          formatDate(etablissement.dateCreation)) ||
          '',
        <>
          <IsActiveTag
            etatAdministratif={etablissement.etatAdministratif}
            statutDiffusion={etablissement.statutDiffusion}
            since={etablissement.dateFermeture}
          />
        </>,
      ])}
    />
  );
};
