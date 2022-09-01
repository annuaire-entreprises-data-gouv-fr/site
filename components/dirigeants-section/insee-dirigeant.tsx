import React from 'react';
import HorizontalSeparator from '../../components-ui/horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { EAdministration } from '../../models/administration';
import { INSEE } from '../administrations';
import { IEtatCivil } from '../../models/immatriculation/rncs';

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
    //eslint-disable-next-line
    ['Rôle', <b>Représentant Légal</b>],
    ['Nom', (dirigeant.sexe === 'M' ? 'M. ' : 'Mme ') + dirigeant.nom],
    ['Prénom', dirigeant.prenom],
  ];

  const femininMasculin = dirigeant.sexe === 'M' ? '' : 'e';

  return (
    <>
      <Section
        id="insee-dirigeant"
        title={'Dirigeant'}
        sources={[EAdministration.INSEE]}
      >
        <p>
          Cette entité est une entreprise individuelle. Elle a un
          {femininMasculin} dirigeant{femininMasculin} enregistré
          {femininMasculin} auprès de l’
          <INSEE />
          &nbsp;:
        </p>
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
      <style jsx>{``}</style>
    </>
  );
};
export default DirigeantsEntrepriseIndividuelleSection;
