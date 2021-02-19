import React from 'react';

const MapboxInstance = () => (
  <>
    <div id="map" />

    <script src="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js"></script>
    <link
      href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
      rel="stylesheet"
    />

    <style jsx>{`
      .results-counter {
        margin-top: 10px;
        margin-bottom: 10px;
        color: rgb(112, 117, 122);
        margin-bottom: 15px;
      }
      .title {
        color: #000091;
        text-decoration: none;
        font-size: 1.4rem;
        margin-bottom: 5px;
      }
      .map-container {
        display: flex;
        flex-direction: row-reverse;
        height: calc(100vh - 140px);
      }
      .map-results {
        width: 550px;
        flex-shrink: 0;
        font-size: 1rem;
        height: 100%;
        overflow: auto;
      }
      .map-results > .results {
        padding: 0 10px;
        height: calc(100% - 60px);
        overflow: auto;
      }
      .map-results > .results-footer {
        height: 50px;
        width: 100%;
        display: flex;
        border-top: 1px solid #dfdff1;
      }
      #map {
        background: #dfdff1;
        width: 100%;
      }

      @media only screen and (min-width: 1px) and (max-width: 1100px) {
        .map-container {
          display: block;
          height: auto;
        }
        .map-results {
          width: 100%;
        }
        #map {
          background: #dfdff1;
          min-height: 30vh;
        }
        .map-results > .results {
          height: auto;
          overflow: none;
        }
      }
    `}</style>
  </>
);

export default MapboxInstance;
