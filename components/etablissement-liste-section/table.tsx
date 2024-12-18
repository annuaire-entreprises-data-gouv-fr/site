'use client';

import { Icon } from '#components-ui/icon/wrapper';
import { Tag } from '#components-ui/tag';
import IsActiveTag from '#components-ui/tag/is-active-tag';
import { NonDiffusibleTag } from '#components-ui/tag/non-diffusible-tag';
import { FullTable } from '#components/table/full';
import { estDiffusible, estNonDiffusibleStrict } from '#models/core/diffusion';
import { estActif } from '#models/core/etat-administratif';
import { IEtablissement } from '#models/core/types';
import { formatDate, formatSiret } from '#utils/helpers';

export const EtablissementTable: React.FC<{
  etablissements: IEtablissement[];
}> = ({ etablissements }) => {
  etablissements
    .sort((e) => (estActif(e) ? -1 : 1))
    .sort((e) => (e.estSiege ? -1 : 1));

  return (
    <FullTable
      head={['Établissement (siret, adresse, activité)', 'Création', 'État']}
      body={etablissements.map((etablissement: IEtablissement) => [
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
              <div>
                {etablissement.libelleActivitePrincipale} (
                {etablissement.activitePrincipale})
              </div>
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
