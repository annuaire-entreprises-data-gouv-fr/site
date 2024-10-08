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
          <a href="https://annuaire-entreprises.data.gouv.fr">
            <strong>L’Annuaire des Entreprises</strong>
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
            au titre de ses missions d’innovation, d’ouverture et de circulation
            de la donnée.
          </li>
          <li>
            le projet a bénéficié en 2022 du programme{' '}
            <strong>France Relance</strong> à hauteur de 145 536 €.
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
            ['Expertise sécurité', '-', '-', '-', '15 000 €'],
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
        <p>
          <strong>NB :</strong> contrairement aux entreprises du secteur privé,
          les administrations ne peuvent pas récupérer la TVA supportée sur
          leurs achats dans le cadre de leur activité. Le montant TTC inclut la
          TVA au taux de 20%. La TVA est collectée et reversée à l’État et
          diminue donc le montant du budget utilisable sur le projet.
        </p>
        <h2>Impact</h2>
        <p>
          Mise en regard des dépenses au vu des mesures d’impact du projet (les
          statistiques 2024 sont des estimations) :
        </p>
        <FullTable
          head={[
            'Mesure d’impact pour le grand public',
            '2021',
            '2022',
            '2023',
            '2024 (prévisionnel)',
          ]}
          body={[
            [
              'Fiche “entreprise” consultées',
              '768 000',
              '2 788 000',
              '12 934 000',
              '40 000 000',
            ],
            ['・€ / page', '0,25 €', '0,11 €', '0,04 €', '0,02 €'],
            [
              'Visiteurs uniques',
              '156 000',
              '781 000',
              '3 775 000',
              '12 000 000',
            ],
            ['・€ / visiteur unique', '1,2 €', '0,45 €', '0,15 €', '0,06 €'],
          ]}
        ></FullTable>
        <br />
        <p>
          En 2024, la DINUM a créé un{' '}
          <a href="/lp/agent-public">compte pour les agents public</a>. Ce
          compte permet aux agents publics d’accèder à des données
          complémentaires sur les entreprises. Cela{' '}
          <strong>facilite leur travail</strong> et leur{' '}
          <strong>
            évite de redemander ces données aux entreprises elles-mêmes
          </strong>
          .
        </p>
        <FullTable
          head={[
            'Mesure d’impact pour les agents publics',
            '2024 (prévisionnel)',
          ]}
          body={[
            ['Fiches “entreprise” consultées par des agents', '480 000'],
            ['Agents publics uniques', '45 000'],
            ['・€ / agent public / mois', '1,6 €'],
          ]}
        ></FullTable>
        <p>
          Le détail de nos mesures d’impact est disponible sur notre{' '}
          <a href="/a-propos/stats">page de statistiques</a>.
        </p>
      </TextWrapper>
    </div>
  );
}
