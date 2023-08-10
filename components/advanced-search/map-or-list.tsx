import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';

const MapOrListSwitch = ({ isMap = false, query = '' }) => (
  <>
    {isMap ? (
      <a href={`/rechercher/${query}`}>
        <Icon color={constants.colors.frBlue} slug="listUnordered">
          Afficher en liste
        </Icon>
      </a>
    ) : (
      <a href={`/rechercher/carte${query}`}>
        <Icon color={constants.colors.frBlue} slug="mapPin">
          Afficher sur une carte
        </Icon>
      </a>
    )}
  </>
);

export default MapOrListSwitch;
