import React from 'react';
import Page from '../../layouts';

const Logout: React.FC = () => {
  return (
    <Page title="Echec de la connexion avec FranceConnect" noIndex={true}>
      <h1>Echec de la connexion avec FranceConnect</h1>
      <p>Merci de réessayer plus tard.</p>
      <style jsx>{`
        h1,
        p {
          text-align: center;
        }
      `}</style>
    </Page>
  );
};
export default Logout;
