import React from 'react';
import Page from '../../layouts';

const Logout: React.FC = () => {
  return (
    <Page title="Au revoir" noIndex={true} session={null}>
      <h1>Au revoir 👋</h1>
      <p>Nous espérons vous revoir très bientôt !</p>
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
