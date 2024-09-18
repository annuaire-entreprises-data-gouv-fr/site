import { Metadata } from 'next';
import TextWrapper from '#components-ui/text-wrapper';
import { FullTable } from '#components/table/full';

export const metadata: Metadata = {
  title: 'Budget de l’Annuaire des Entreprises',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/a-propos/budget',
  },
  robots: 'noindex, nofollow',
};

export default function Budget() {
  return (
    <div>
      <TextWrapper>
        <h1>Budget</h1>
        <p>
          L’
          <a href="https://annuaire-entreprises.data.gouv.fr">
            <strong>Annuaire des Entreprises</strong>
          </a>{' '}
          est un service public numérique, c’est pourquoi nous sommes
          transparents sur les ressources allouées et la manière dont elles sont
          employées.
        </p>
        <h2>Financement</h2>
        <p>Répartition des sources de financements :</p>
        <ul>
          <li>
            le projet est financé en majorité par la{' '}
            <a href="https://numerique.gouv.fr/" target="_blank" rel="noopener">
              Direction Interministérielle du Numérique (DINUM)
            </a>{' '}
            au titre de ses missions d’ouverture et de circulation de la donnée.
          </li>
          <li>
            le projet a bénéficié en 2022 du programme{' '}
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
        <h2>Dépenses</h2>
        <p>Répartition des dépenses effectuées :</p>
        <FullTable
          head={[
            'Poste de dépense',
            '2021',
            '2022',
            '2023',
            '2024 (prévisionnel)',
          ]}
          body={[
            [
              'Développement',
              '165 000 €',
              '213 000 €',
              '375 000 €',
              '433 000 €',
            ],
            ['Déploiement', '5 000 €', '98 000 €', '157 000 €', '255 000 €'],
            ['Design', '25 000 €', '25 000 €', '43 000 €', '60 000 €'],
            ['Logiciels', '-', '12 000 €', '12 000 €', '12 000'],
            ['Sécurité', '-', '-', '-', '15 000 €'],
            ['Hébergement', '1000 €', '3000 €', '3000 €', '25 000 €'],
            [
              <strong>Total TTC</strong>,
              <strong>196 000 €</strong>,
              <strong>350 000 €</strong>,
              <strong>590 000 €</strong>,
              <strong>800 000 €</strong>,
            ],
          ]}
        ></FullTable>
        <h2>Impact</h2>
        <p>
          Mise en regard de nos dépenses et de notre impact (les statistiques
          2024 sont des estimations):
        </p>
        <FullTable
          head={[
            'Mesure d’impact',
            '2021',
            '2022',
            '2023',
            '2024 (prévisionnel)',
          ]}
          body={[
            ['Pages “entreprise” consultées', '768k', '3M', '13M', '40M'],
            [' ‣ € / page', '0,25 €', '0,11 €', '0,04 €', '0,02 €'],
            ['Visiteurs uniques', '156k', '781k', '3,7M', '12M'],
            [' ‣ € / visiteur unique', '1,2 €', '0,45 €', '0,15 €', '0,06 €'],
            ['Agents publics', '-', '-', '-', '40k'],
            [' ‣ € / agent public / an', '-', '-', '-', '20 €'],
          ]}
        ></FullTable>
        <p>
          Le détail de nos mesures d’impact est disponible sur notre{' '}
          <a href="/a-propos/stats">page de statistiques</a>.
        </p>
        <h2>À propos de la TVA</h2>
        <p>
          Contrairement aux entreprises du secteur privé, les administrations ne
          peuvent pas récupérer la TVA supportée sur leurs achats dans le cadre
          de leur activité. Le montant TTC inclut la TVA au taux de 20%.
          <br />
          La TVA est collectée et reversée à l’État et diminue donc le montant
          du budget utilisable sur le projet.
        </p>
      </TextWrapper>
    </div>
  );
}
