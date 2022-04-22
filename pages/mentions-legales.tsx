import React from 'react';
import { NextPage } from 'next';

import Page from '../layouts/page';

const Privacy: NextPage = () => (
  <Page title="Politique de confidentialité" noIndex={true}>
    <div className="content-container">
      <h1>Mentions légales</h1>
      <h2>Éditeur</h2>
      <p>
        Ce site est édité par l’incubateur des services numériques, Direction
        interministérielle du numérique (DINUM), Services du Premier ministre.
      </p>
      <h2>Conception et gestion du site</h2>
      <p>
        Ce site est développé en mode agile, selon un principe d’amélioration
        continue. De nouvelles fonctionnalités seront ajoutées prochainement.
      </p>
      <h2>Code source du site</h2>
      <p>Le code source du site est disponible sur Github.</p>
      <h2>Hébergement</h2>
      <p>
        OVH 2 rue Kellermann - 59100 Roubaix - France Tel. 09 72 10 10 07 (prix
        d’un appel vers un poste fixe en France)
      </p>
    </div>
  </Page>
);

export default Privacy;
