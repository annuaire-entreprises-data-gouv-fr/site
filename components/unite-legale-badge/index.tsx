import { communityFill, buildingFill, user } from '../../components-ui/icon';
import { isAssociation, IUniteLegale } from '../../models';

const determineType = (uniteLegale: IUniteLegale) => {
  if (isAssociation(uniteLegale)) {
    return {
      icon: communityFill,
      label: 'Association',
      colors: ['#e5d2f9;', '#3d0d71'],
    };
  }
  if (uniteLegale.complements.estEntrepreneurIndividuel) {
    return {
      icon: user,
      label: 'Entreprise Individuelle',
      colors: ['#95e3e8', '#034e6e'],
    };
  }

  // colter
  // return {
  //   icon: humanPin,
  //   label: 'Collectivité territoriale',
  //   colors: ['#f9f0d2', '#563003'],
  // };

  // default case
  return {
    icon: buildingFill,
    label: 'Unité Légale',
    colors: ['#d2e9f9', '#000091'],
    isDefault: true,
  };
};

const UniteLegaleBadge: React.FC<{
  uniteLegale: IUniteLegale;
  small: boolean;
  hiddenByDefault: boolean;
}> = ({ uniteLegale, small = false, hiddenByDefault = false }) => {
  const {
    icon,
    label,
    isDefault = false,
    colors: [background, font],
  } = determineType(uniteLegale);

  if (hiddenByDefault && isDefault) {
    return null;
  }

  return (
    <span className="badge-wrapper">
      <span className="badge-icon">{icon}</span>
      <span className="badge-label">{label}</span>
      <style jsx>{`
      .badge-wrapper {
        display: flex;
        align-items: stretch;
        justify-content: center;
        font-size: ${small ? '0.9rem' : '1rem'};
        margin:2px 0;
      }

      .badge-icon {
        border-top-left-radius: 50px;
        border-bottom-left-radius: 50px;
        background-color: ${background};
        color: ${font};
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding:  ${small ? '0' : '2px'} ${small ? '4px' : '7px'} ;
π      }

      .badge-label {
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;
        background-color: #eee;
        color: #555;
        font-weight: bold;
        padding: ${small ? '0' : '2px'}  ${small ? '4px' : '7px'} ;
      }
    `}</style>
    </span>
  );
};

export default UniteLegaleBadge;
