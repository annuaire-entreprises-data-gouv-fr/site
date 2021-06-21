import React from 'react';
import HorizontalSeparator from '../horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { EAdministration } from '../../models/administration';
import { IEtatCivil } from '../../models/dirigeants';

interface IProps {
  dirigeant: IEtatCivil;
}

/**
 * Specific section for EI
 * @param param0
 * @returns
 */
const DirigeantsEntrepriseIndividuelleSection: React.FC<IProps> = ({
  dirigeant,
}) => {
  const data = [
    ['Rôle', <b>Représentant Légal</b>],
    ['Nom', (dirigeant.sexe === 'M' ? 'Mr ' : 'Mme ') + dirigeant.nom],
    ['Prénom', dirigeant.prenom],
  ];

  const femininMasculin = dirigeant.sexe === 'M' ? '' : 'e';

  return (
    <>
      <p>
        {`Cette entité est une entreprise individuelle. Elle n’a qu’un${femininMasculin}
        seul${femininMasculin} dirigeant${femininMasculin}.`}
      </p>
      <Section
        title={'Les informations sur le dirigeant'}
        source={EAdministration.INSEE}
      >
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
      <style jsx>{``}</style>
    </>
  );
};
export default DirigeantsEntrepriseIndividuelleSection;
