import { Warning } from '#components-ui/alerts';
import { TwoColumnTable } from '#components/table/simple';
import { IAssociation } from '#models/core/types';
import { formatIntFr, isTwoMonthOld } from '#utils/helpers';

export const AssociationNotFound: React.FC<{
  uniteLegale: IAssociation;
}> = ({ uniteLegale }) => (
  <>
    <Warning>
      Cette structure est une association, mais aucune information n’a été
      trouvée dans le{' '}
      <strong>Répertoire National des Associations (RNA)</strong>.
      {!isTwoMonthOld(uniteLegale.dateCreation) && (
        <>
          <br />
          Cette structure a été créée il y a moins de deux mois. Il est donc
          possible qu’elle n’ait pas encore été publiée au RNA et qu’elle le
          soit prochainement.
        </>
      )}
    </Warning>
    <TwoColumnTable
      body={[
        ['N°RNA', formatIntFr(uniteLegale.association.idAssociation || '')],
      ]}
    />
  </>
);
