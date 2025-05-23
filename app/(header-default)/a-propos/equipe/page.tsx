import TextWrapper from '#components-ui/text-wrapper';
import { Metadata } from 'next';
import styles from './style.module.css';

const team = [
  {
    photoUrl: '/images/team/hajar.jpg',
    fullname: 'Hajar Ait El Kadi',
    pronoun: 'une',
    role: 'intrapreneure',
  },
  {
    photoUrl: '/images/team/hadrien.jpg',
    fullname: 'Hadrien Bossard',
    pronoun: 'un',
    role: 'data engineer',
  },
  {
    photoUrl: '/images/team/anais.jpg',
    fullname: 'Anais Tailhade',
    pronoun: 'une',
    role: 'coach support utilisateur',
  },
  {
    photoUrl: '/images/team/laura.jpg',
    fullname: 'Laura Chevillotte',
    pronoun: 'une',
    role: 'responsable du support utilisateur',
  },
  {
    photoUrl: '/images/team/paul.jpeg',
    fullname: 'Paul Lesur',
    pronoun: 'un',
    role: 'devops',
  },
  {
    photoUrl: '/images/team/jonathan.jpg',
    fullname: 'Jonathan Louis',
    pronoun: 'un',
    role: 'chargé de déploiement SEO & communication',
  },
  {
    photoUrl: '/images/team/amandine.jpg',
    fullname: 'Amandine Audras',
    pronoun: 'une',
    role: 'UX designeure',
  },
  {
    photoUrl: '/images/team/robin.jpg',
    fullname: 'Robin Monnier',
    pronoun: 'un',
    role: 'lead développeur',
  },
];

export const metadata: Metadata = {
  title: 'Qui est l’équipe derrière l’Annuaire des Entreprises',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/a-propos/equipe',
  },
  robots: 'noindex, follow',
};

export default function Equipe() {
  return (
    <div>
      <TextWrapper>
        <h1>Qui sommes-nous ?</h1>
        <h2>Qui construit l’Annuaire des Entreprises ?</h2>
        <p>
          Ce site public est développé et maintenu par la Direction
          interministérielle du numérique{' '}
          <a
            href="https://www.numerique.gouv.fr/dinum/"
            target="_blank"
            rel="noopener noreferrer"
          >
            (DINUM)
          </a>
          , en coopération avec la{' '}
          <a
            href="https://entreprises.gouv.fr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Direction Générale des Entreprises (DGE)
          </a>{' '}
          et les{' '}
          <a href="/donnees/sources">
            administrations qui fournissent la donnée
          </a>
          .
        </p>

        <h2>Notre méthode</h2>
        <p>
          L’Annuaire des Entreprises est un site de l’État qui s’inspire des{' '}
          <a href="https://beta.gouv.fr/manifeste">méthodes agiles</a>{' '}
          développées au sein de <a href="https://beta.gouv.fr/">beta.gouv</a>.
        </p>

        <p>
          Nous testons donc en permanence de nouvelles fonctionnalités. Si elles
          ne correspondent pas aux attentes des utilisateurs, elles peuvent être
          modifiées ou même supprimées. C’est une logique d’amélioration qui
          accepte l’erreur comme une tentative et non comme une fatalité.
        </p>

        <h2>Nos objectifs</h2>

        <ul>
          <li>
            Simplifier les démarches administratives (pour les entreprises et
            les agents publics)
          </li>
          <li>
            Améliorer la fiabilité des informations légales des entreprises,
            associations et administrations
          </li>
          <li>Informer sur les données affichées</li>
          <li>
            Mettre en cohérence les différentes données publiques, actuellement
            dispersées au sein des administrations françaises
          </li>
          <li>
            Participer à une meilleure transparence de l’information publique
            ouverte (logique d’open data, de données ouvertes)
          </li>
        </ul>

        <h2>Ce que nous ne faisons pas</h2>
        <ul>
          <li>
            Proposer des outils d’intelligence économique (surveillance, alerte
            mail, enrichissement de CRM)
          </li>
          <li>
            Effectuer une correction sur une information affichée (pour une
            entreprise, consultez{' '}
            <a href="https://formalites.entreprises.gouv.fr">
              le site de formalités des entreprises de l’INPI
            </a>
            , pour une association consultez{' '}
            <a href="https://lecompteasso.associations.gouv.fr/">
              Le Compte Asso
            </a>
            )
          </li>
          <li>Informer sur des informations non affichées</li>
        </ul>

        <h2>La fine équipe</h2>

        <p>Notre équipe est constituée de :</p>

        <ul>
          {team.map(({ pronoun, role }) => (
            <li key={role}>
              {pronoun} {role}
            </li>
          ))}
        </ul>
        <p>
          Plus d’informations{' '}
          <a href="https://beta.gouv.fr/startups/annuaire-entreprises.html">
            sur la page beta.gouv du projet
          </a>
          .
        </p>
        <div className={styles['team-members']}>
          {team.map((member) => (
            <div className={styles['team-member']} key={member.fullname}>
              <img
                src={member.photoUrl}
                alt={`Photo de ${member.fullname} - ${member.role}`}
                title={`Photo de ${member.fullname} - ${member.role}`}
              />
            </div>
          ))}
        </div>
      </TextWrapper>
    </div>
  );
}
