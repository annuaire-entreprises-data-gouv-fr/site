import React from 'react';
import routes from '../../clients/routes';
import { IUniteLegale } from '../../models';
import { formatIntFr } from '../../utils/helpers/formatting';
import Warning from '../alerts/warning';

const AssociationCreationNotFound: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => (
  <Warning>
    Nous n’avons pas retrouvé l’annonce de création de cette association dans le{' '}
    <b>Journal Officiel des Association (JOAFE).</b>
    <br />
    Les annonces les plus anciennes du Journal Officiel peuvent contenir des
    erreures de saisie qui ne nous permettent pas de les retrouver grâce à leur
    numéro RNA ({formatIntFr(uniteLegale.association?.id)}).
    <br />
    En revanche, vous pouvez probablement retrouver l’annonce de création grâce
    au{' '}
    <a
      target="_blank"
      rel="noreferrer noopener"
      href={routes.journalOfficielAssociations.site.recherche}
    >
      moteur de recherche du Journal Officiel
    </a>
    .
  </Warning>
);

export default AssociationCreationNotFound;
