import React from 'react';

const MapboxInstance = () => (
  <>
    <div id="map" />
    <script
      async
      src="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js"
    ></script>
    <link
      href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
      rel="stylesheet"
    />

    <style jsx>{`
      #map {
        background: #dfdff1;
        width: 100%;
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

export default MapboxInstance;
