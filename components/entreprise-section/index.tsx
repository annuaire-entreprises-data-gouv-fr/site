import React from 'react';
import { IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administration';
import {
  capitalize,
  formatDate,
  formatDateLong,
  formatNumbersFr,
} from '../../utils/helpers/formatting';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import HorizontalSeparator from '../horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';

const entrepriseDescription = (uniteLegale: IUniteLegale) => (
  <>
    <>L’entité {uniteLegale.nomComplet}</>{' '}
    {uniteLegale.natureJuridique && (
      <>
        est une <b>{uniteLegale.libelleNatureJuridique}</b>{' '}
      </>
    )}
    {uniteLegale.dateCreation && (
      <>
        créée le <b>{formatDateLong(uniteLegale.dateCreation)}</b>
      </>
    )}
    {uniteLegale.dateDebutActivite &&
      uniteLegale.siege &&
      !uniteLegale.siege.estActif && (
        <>
          {' '}
          et fermée le <b>{formatDateLong(uniteLegale.dateDebutActivite)}</b>
        </>
      )}
    {uniteLegale.siege && uniteLegale.siege.adresse && (
      <>
        , dont le siège est domicilié au{' '}
        <a href={`/rechercher/carte?siret=${uniteLegale.siege.siret}`}>
          {uniteLegale.siege.adresse}
        </a>
      </>
    )}
    .{' '}
    {uniteLegale.etablissements && (
      <>
        Cette entité possède{' '}
        <a href={`#etablissements`}>
          {uniteLegale.etablissements.length} établissement(s).
        </a>
      </>
    )}
    <br />
    <br />
  </>
);

const EntrepriseSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const data = [
    ['Dénomination', capitalize(uniteLegale.nomComplet)],
    ['SIREN', formatNumbersFr(uniteLegale.siren)],
    [
      'SIRET du siège social',
      uniteLegale.siege &&
        uniteLegale.siege.siret &&
        formatSiret((uniteLegale.siege || {}).siret),
    ],
    ['N° TVA Intracommunautaire', formatNumbersFr(uniteLegale.numeroTva)],
    [
      'Activité principale (du siège social)',
      uniteLegale.libelleActivitePrincipale,
    ],
    ['Nature juridique', uniteLegale.libelleNatureJuridique],
    [
      'Tranche effectif salarié de l’entité',
      uniteLegale.libelleTrancheEffectif,
    ],
    ['Date de création', formatDate(uniteLegale.dateCreation)],
    [
      'Date de dernière mise à jour',
      formatDate(uniteLegale.dateDerniereMiseAJour),
    ],
  ];
  if (uniteLegale.siege && uniteLegale.siege.estActif === false) {
    data.push(['Date de fermeture', formatDate(uniteLegale.dateDebutActivite)]);
  }

  return (
    <div id="entreprise">
      <p>{entrepriseDescription(uniteLegale)}</p>
      <Section
        title={`Les informations sur cette entité`}
        source={EAdministration.INSEE}
      >
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
    </div>
  );
};

export default EntrepriseSection;
