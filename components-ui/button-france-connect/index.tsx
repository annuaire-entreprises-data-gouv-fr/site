import React from 'react';

const ButtonFranceConnect: React.FC<{}> = () => (
  <div className="fr-connect-group">
    <button className="fr-connect">
      <span className="fr-connect__login">S’identifier avec</span>
      <span className="fr-connect__brand">FranceConnect</span>
    </button>
    <p>
      <a
        href="https://franceconnect.gouv.fr/"
        target="_blank"
        rel="noopener noreferrer"
        title="Qu’est-ce que FranceConnect ? - nouvelle fenêtre"
      >
        Qu’est-ce que FranceConnect ?
      </a>
    </p>
  </div>
);

export default ButtonFranceConnect;
