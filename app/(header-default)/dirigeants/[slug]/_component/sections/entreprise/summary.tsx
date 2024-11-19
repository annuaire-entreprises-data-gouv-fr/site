import { isServicePublic, IUniteLegale } from '#models/core/types';

type IDirigeantSummaryProps = {
  uniteLegale: IUniteLegale;
};

const DirigeantSummary: React.FC<IDirigeantSummaryProps> = ({
  uniteLegale,
}) => {
  if (uniteLegale.association.idAssociation) {
    return null;
  }
  if (isServicePublic(uniteLegale)) {
    return null;
  }

  return (
    <nav role="navigation" aria-labelledby="dirigeant-summary-title">
      <strong id="dirigeant-summary-title">
        Informations disponibles sur les dirigeant(s) :
      </strong>
      <ul>
        <li>
          <a href="#rne-dirigeants">
            Liste des dirigeants inscrits au Registre National des Entreprises
            (RNE)
          </a>
        </li>
        <li>
          <a href="#beneficiaires">Liste des bénéficiaires effectifs</a>
        </li>
      </ul>
      <br />
    </nav>
  );
};

export default DirigeantSummary;
