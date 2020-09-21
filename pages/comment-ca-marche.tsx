import React from 'react';

import SearchBar from '../components/searchBar';
import Page from '../layouts';

const About: React.FC = () => {
  return (
    <Page small={true}>
      <div className="content-container">
        <h1>Comment ça marche ?</h1>
        <div>
          Alors, ici on raconte un peu :
          <ul>
            <li>Le cadre légal, la supression du KBIS toussa</li>
            <li>
              D'où viennent les données (on met des liens pour chaque sources,
              vers data.gouv puis vers api.gouv)
            </li>
            <li>Comment on peut en avoir plus #api-entreprise</li>
            <li>Comment nous contacter</li>
          </ul>
        </div>
      </div>
    </Page>
  );
};

export default About;
