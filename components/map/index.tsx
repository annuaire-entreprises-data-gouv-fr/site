import React from 'react';

const MaplibreInstance = () => (
  <>
    <div id="map" />
    <script
      async
      src="https://unpkg.com/maplibre-gl@1.15.2/dist/maplibre-gl.js"
    ></script>
    <link
      href="https://unpkg.com/maplibre-gl@1.15.2/dist/maplibre-gl.css"
      rel="stylesheet"
    />

    <style jsx>{`
      #map {
        background: #dfdff1;
        width: 100%;
        z-index: 0;
      }
      @media only screen and (min-width: 1px) and (max-width: 1100px) {
        #map {
          background: #dfdff1;
          min-height: 30vh;
        }
      }
    `}</style>
  </>
);

export default MaplibreInstance;
