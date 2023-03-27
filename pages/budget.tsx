import React from 'react';
import Info from '#components-ui/alerts/info';
import TextWrapper from '#components-ui/text-wrapper';
import Meta from '#components/meta';
import { FullTable } from '#components/table/full';
import { NextPageWithLayout } from './_app';

const Budget: NextPageWithLayout = () => (
  <div>
    <Meta noIndex title="Politique de confidentialité"></Meta>
    <TextWrapper>
      <h1>Budget</h1>
      <p>
        L’<b>Annuaire des Entreprises</b> est un service public numérique, c’est
        pourquoi nous sommes transparents sur les ressources allouées et la
        manière dont elles sont employées.
      </p>
      <h2>Principes</h2>
      <p>
        Nous suivons{' '}
        <a href="https://beta.gouv.fr/approche/manifeste">
          le manifeste beta.gouv
        </a>{' '}
        dont nous rappelons les principes ici :
      </p>
      <div className="fr-highlight">
        <ul>
          <li>
            Les besoins des utilisateurs sont prioritaires sur les besoins de
            l’administration
          </li>
          <li>Le mode de gestion de l’équipe repose sur la confiance</li>
          <li>
            L’équipe adopte une approche itérative et d’amélioration en continu
          </li>
        </ul>
      </div>
      <h2>Budget consommé</h2>
      <FullTable
        head={['Poste de dépense', '2021', '2022', '2023 (projection)']}
        body={[
          ['Développement', '', ''],
          ['Déploiement', '', ''],
          ['Design', '', ''],
          ['Hébergement & infrastructure', '', ''],
          [<b>Total TTC</b>, '', ''],
        ]}
      ></FullTable>
      <Info>
        <b>À propos de la TVA</b>
        <p>
          Contrairement aux entreprises du secteur privé, les administrations ne
          peuvent pas récupérer la TVA supportée sur leurs achats dans le cadre
          de leur activité. Le montant TTC inclut la TVA au taux de 20%.
          <br />
          La TVA est collectée et reversée à l’État et diminue donc le montant
          du budget utilisable sur le projet.
        </p>
      </Info>
    </TextWrapper>
  </div>
);

export default Budget;
