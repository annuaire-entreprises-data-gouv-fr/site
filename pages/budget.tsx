import Info from '#components-ui/alerts/info';
import TextWrapper from '#components-ui/text-wrapper';
import Meta from '#components/meta';
import { FullTable } from '#components/table/full';
import { NextPageWithLayout } from './_app';

const Budget: NextPageWithLayout = () => (
  <div>
    <Meta
      noIndex
      title="Politique de confidentialité"
      canonical="https://annuaire-entreprises.data.gouv.fr/budget"
    />
    <TextWrapper>
      <h1>Budget</h1>
      <p>
        L’
        <a href="https://annuaire-entreprises.data.gouv.fr">
          <b>Annuaire des Entreprises</b>
        </a>{' '}
        est un service public numérique, c’est pourquoi nous sommes transparents
        sur les ressources allouées et la manière dont elles sont employées.
      </p>
      <h2>Principes</h2>
      <p>
        Nous suivons{' '}
        <a href="https://beta.gouv.fr/manifeste">le manifeste beta.gouv</a> dont
        nous rappelons les principes ici :
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
      <p>Répartition des sources de financements :</p>
      <ul>
        <li>
          <b>2021</b> : le projet est une experimentation financée à 100% par la{' '}
          <a href="https://numerique.gouv.fr/" target="_blank" rel="noopener">
            Direction Interministérielle du Numérique (DINUM)
          </a>
          .
        </li>
        <li>
          <b>2022</b> : la DINUM continue d’assurer le financement du projet. Le
          projet bénéficie également du programme{' '}
          <a
            href="https://france-relance.transformation.gouv.fr/"
            target="_blank"
            rel="noopener"
          >
            France Relance
          </a>{' '}
          à hauteur de 145 536 €.
        </li>
      </ul>
      <p>Répartition des dépenses effectuées :</p>
      <FullTable
        head={['Poste de dépense', '2021', '2022', '2023']}
        body={[
          ['Développement', '165 000 €', '213 000 €', '375 000 €'],
          ['Déploiement', '5 000 €', '98 000 €', '157 000 €'],
          ['Design', '25 000 €', '25 000 €', '43 000 €'],
          ['Logiciels', '-', '12 000 €', '12 000 €'],
          ['Hébergement', '1000 €', '3000 €', '3000 €'],
          [
            <b>Total TTC</b>,
            <b>196 000 €</b>,
            <b>350 000 €</b>,
            <b>590 000 €</b>,
          ],
        ]}
      ></FullTable>
      <br />
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
