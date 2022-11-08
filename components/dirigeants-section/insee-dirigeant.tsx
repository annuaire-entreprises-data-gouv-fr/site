import React from 'react';
import HorizontalSeparator from '../../components-ui/horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { EAdministration } from '../../models/administrations';
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
    ['Rôle', <b>Représentant Légal</b>],
    ['Nom', `${dirigeant.prenom} ${dirigeant.nom}`],
    ['Mois et année de naissance', ''],
    [
      '',
      <a href={`/rechercher?fn=${dirigeant.prenom}&n=${dirigeant.nom}`}>
        → rechercher les entreprises dirigées par une personne appelée «{' '}
        {dirigeant.prenom} {dirigeant.nom} »
      </a>,
    ],
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
