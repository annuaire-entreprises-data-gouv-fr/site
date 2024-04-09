import styles from './style.module.css';
const MaplibreInstance = () => (
  <>
    <div className={styles['map']} id="map" />
    <script src="https://unpkg.com/maplibre-gl@1.15.2/dist/maplibre-gl.js"></script>
    <link
      href="https://unpkg.com/maplibre-gl@1.15.2/dist/maplibre-gl.css"
      rel="stylesheet"
    />
  </>
);

export default MaplibreInstance;
