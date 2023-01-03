import { mapPin } from '#components-ui/icon';

const MapOrListSwitch = ({ isMap = false, query = '' }) => (
  <>
    {isMap ? (
      <a href={`/rechercher/${query}`}>
        Afficher les résultats sous forme de liste
      </a>
    ) : (
      <a href={`/rechercher/carte${query}`}>{mapPin} Afficher sur une carte</a>
    )}
  </>
);

export default MapOrListSwitch;
