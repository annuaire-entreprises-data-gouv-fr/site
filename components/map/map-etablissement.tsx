'use client';

import { IEtablissement } from '#models/core/types';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';

export const EtablissementsMap = ({
  etablissements,
}: {
  etablissements: IEtablissement[];
}) => {
  return <>carte</>;
  // const mapContainer = useRef<HTMLDivElement>(null);
  // const map = useRef<Map | null>(null);
  // const coords = checkLatLng(etablissement.latitude, etablissement.longitude);
  // useEffect(() => {
  //   if (map.current || !coords) return; // stops map from intializing more than once
  //   const zoom = etablissement ? 12 : 4.5;
  //   map.current = new maplibregl.Map({
  //     //@ts-ignore
  //     container: mapContainer.current,
  //     style: `https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json`,
  //     center: coords,
  //     zoom,
  //     minZoom: 3,
  //     attributionControl: {
  //       compact: true,
  //     },
  //   });
  //   const popup = new maplibregl.Popup({ offset: 30 }).setHTML(
  //     `<div><strong>${formatSiret(etablissement.siret)}</strong><br/>📍${
  //       etablissement.adresse
  //     }</div>`
  //   );
  //   new maplibregl.Marker({ color: constants.colors.frBlue })
  //     .setLngLat(coords)
  //     .setPopup(popup)
  //     .addTo(map.current);
  // }, [etablissement, coords]);
  // return (
  //   <div
  //     style={{
  //       padding: '20px 0',
  //     }}
  //   >
  //     {coords ? (
  //       <div
  //         ref={mapContainer}
  //         className="map"
  //         style={{ width: '100%', zIndex: '0', height: '450px' }}
  //       />
  //     ) : (
  //       <i>
  //         Nous n’avons pas réussi à déterminer la géolocalisation de cet
  //         établissement, car ses coordonnées sont invalides ou inconnues : [
  //         {etablissement.latitude || '⎽'}°, {etablissement.longitude || '⎽'}°].
  //       </i>
  //     )}
  //   </div>
  // );
};
