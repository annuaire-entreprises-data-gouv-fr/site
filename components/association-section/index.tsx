import React from 'react';
import { IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administration';
import { isTwoMonthOld } from '../../utils/helpers/checks';
import { formatDate, formatIntFr } from '../../utils/helpers/formatting';
import Warning from '../alerts/warning';
import HorizontalSeparator from '../horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';

const AssociationSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const { association } = uniteLegale;

  if (!association || !association.id) {
    throw new Error('This component should never be rendered without a RNA ID');
  }

  const data = [
    ['N° RNA (identifiant d’association)', formatIntFr(association.id)],
    ['Nom', association.nomComplet],
    ['Objet', association.objet],
    ['Adresse', association.adresse],
  ];

  const notInRna =
    !association.nomComplet && !association.objet && !association.adresse;

  return (
    <div id="entreprise">
      <Section
        title={`Les informations au Répertoire National des Associations`}
        source={EAdministration.MI}
      >
        {notInRna ? (
          <>
            <Warning>
              Cette entité possède un identifiant d’association, mais aucune
              information n’a été trouvée dans le{' '}
              <b>Répertoire National des Associations (RNA)</b>.
              {!isTwoMonthOld(uniteLegale.dateCreation) && (
                <>
                  <br />
                  Cette entité a été créée il y a moins de deux mois. Il est
                  donc possible qu’elle n’ait pas encore été publiée au RNA et
                  qu’elle le soit prochainement.
                </>
              )}
            </Warning>
          </>
        ) : (
          <p>
            Cette entité est inscrite au{' '}
            <b>Répertoire National des Associations (RNA)</b>, qui contient les
            informations suivantes&nbsp;:
          </p>
        )}
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
    </div>
  );
};

export default AssociationSection;
