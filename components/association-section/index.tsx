import React from 'react';
import { EAdministration } from '../../models/administrations';
import { IAssociation } from '../../models';
import { isTwoMonthOld } from '../../utils/helpers/checks';
import { formatIntFr } from '../../utils/helpers/formatting';
import Warning from '../../components-ui/alerts/warning';
import BreakPageForPrint from '../../components-ui/print-break-page';
import HorizontalSeparator from '../../components-ui/horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';

const AssociationSection: React.FC<{
  uniteLegale: IAssociation;
}> = ({ uniteLegale }) => {
  const {
    association: {
      idAssociation = '',
      nomComplet = '',
      objet = '',
      adresse = '',
    },
  } = uniteLegale;

  const data = [
    ['N° RNA (identifiant d’association)', formatIntFr(idAssociation)],
    ['Nom', nomComplet],
    ['Objet', objet],
    ['Adresse', adresse],
  ];

  const notInRna = !nomComplet && !objet && !adresse;

  return (
    <>
      <Section
        title={`Répertoire National des Associations`}
        sources={[EAdministration.MI]}
      >
        {notInRna ? (
          <Warning>
            Cette structure est une association, mais aucune information n’a été
            trouvée dans le <b>Répertoire National des Associations (RNA)</b>.
            {!isTwoMonthOld(uniteLegale.dateCreation) && (
              <>
                <br />
                Cette structure a été créée il y a moins de deux mois. Il est
                donc possible qu’elle n’ait pas encore été publiée au RNA et
                qu’elle le soit prochainement.
              </>
            )}
          </Warning>
        ) : (
          <p>
            Cette structure est inscrite au{' '}
            <b>Répertoire National des Associations (RNA)</b>, qui contient les
            informations suivantes&nbsp;:
          </p>
        )}
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
      <BreakPageForPrint />
    </>
  );
};

export default AssociationSection;
