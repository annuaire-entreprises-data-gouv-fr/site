import React from 'react';
import HorizontalSeparator from '../horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { EAdministration } from '../../models/administration';
import { IEtatCivil, IPersonneMorale } from '../../models/dirigeants';
import { IAPINotRespondingError } from '../../models/api-not-responding';
import AdministrationNotResponding from '../administration-not-responding';
import { formatNumbersFr } from '../../utils/helpers/formatting';

interface IProps {
  dirigeants: (IEtatCivil & IPersonneMorale)[] & IAPINotRespondingError;
}

/**
 * Dirigeants section
 * @param param0
 * @returns
 */
const DirigeantsSection: React.FC<IProps> = ({ dirigeants }) => {
  const isAPINotResponding = dirigeants.administration;
  if (isAPINotResponding) {
    return (
      <AdministrationNotResponding
        administration={dirigeants.administration}
        type={dirigeants.type}
      />
    );
  }

  const formatDirigeant = (dirigeant: IEtatCivil & IPersonneMorale) => {
    const isPersonneMorale = dirigeant.siren;
    if (isPersonneMorale) {
      return [
        ['Rôle', <b>{dirigeant.role}</b>],
        ['Dénomination', dirigeant.denomination],
        ['Nature Juridique', dirigeant.natureJuridique],
        [
          'Siren',
          <a href={`/entreprise/${dirigeant.siren}`}>
            {formatNumbersFr(dirigeant.siren)}
          </a>,
        ],
      ];
    } else {
      return [
        ['Rôle', <b>{dirigeant.role}</b>],
        ['Nom', dirigeant.nom],
        ['Prénom', dirigeant.prenom],
        ['Année de Naissance', dirigeant.dateNaissance],
        ['Lieu de Naissance', dirigeant.lieuNaissance],
      ];
    }
  };

  const plural = dirigeants.length > 0 ? 's' : '';

  return (
    <>
      <Section
        title={`Les informations sur le${plural} dirigeant${plural}`}
        source={EAdministration.INPI}
      >
        {dirigeants.map((dirigeant, idx) => (
          <React.Fragment key={'b' + idx}>
            <TwoColumnTable body={formatDirigeant(dirigeant)} />
            {dirigeants.length !== idx + 1 && <br />}
          </React.Fragment>
        ))}
      </Section>
      <HorizontalSeparator />
      <style global jsx>{`
        table > tbody > tr > td:first-of-type {
          width: 30%;
        }
      `}</style>
    </>
  );
};
export default DirigeantsSection;
