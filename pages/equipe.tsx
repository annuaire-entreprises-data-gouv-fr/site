import TextWrapper from '#components-ui/text-wrapper';
import Meta from '#components/meta';
import { NextPageWithLayout } from './_app';

const Equipe: NextPageWithLayout = () => {
  const team = [
    {
      photoUrl:
        'https://media.licdn.com/dms/image/C5603AQGIAb1ihRg0ng/profile-displayphoto-shrink_400_400/0/1643020506289?e=1687996800&v=beta&t=iN937FiOIKwaWpSyLd2NOCFmTvM-yWn8dxj4o1_tT4o',
      photoAlt: 'Photo de Jane Doe intrapreneur chargé de piloter le projet',
      fullname: 'Xavier Jouppe',
      role: 'Intrapreneur chargé de piloter le projet',
    },
    {
      photoUrl: 'https://avatars3.githubusercontent.com/haekadi?s=600',
      photoAlt: 'Photo de Hajar AIT EL KADI data engineer',
      fullname: 'Hajar AIT EL KADI',
      role: 'Data engineer',
    },
    {
      photoUrl:
        'https://media.licdn.com/dms/image/C5603AQEVYzrMNeEk1A/profile-displayphoto-shrink_400_400/0/1571905688713?e=1687996800&v=beta&t=9FcktZgpPF3AQyjwUkyu_yrGhkw8_r4hmnf85L3xIs8',
      photoAlt: 'Photo de Yoan Ficadiere développeur web',
      fullname: 'Yoan Ficadiere',
      role: 'Développeur',
    },
    {
      photoUrl:
        'https://media.licdn.com/dms/image/C4E03AQFC-guw6_nQew/profile-displayphoto-shrink_400_400/0/1517369358753?e=1687996800&v=beta&t=Ij9LlxFEFueOo_8NWMVuiOkYW-Mm2kiVlJSHqOXcO_I',
      photoAlt:
        'Photo de Jonathan Louis chargé de déploiement et de communication',
      fullname: 'Jonathan Louis',
      role: 'Chargés de déploiement et de communication',
    },
    {
      photoUrl:
        'https://media.licdn.com/dms/image/C4E03AQETVFgZWggrCg/profile-displayphoto-shrink_400_400/0/1525470173766?e=1687996800&v=beta&t=jVgQwkB7rFz5262tZko1HX04lWHBhWQVyTzh3yXf5Lw',
      photoAlt:
        'Photo de Karen Mazmanian chargé de déploiement et de communication',
      fullname: 'Karen Mazmanian',
      role: 'Chargés de déploiement et de communication',
    },
    {
      photoUrl:
        'https://media.licdn.com/dms/image/C4D03AQEqDf6tgafatQ/profile-displayphoto-shrink_800_800/0/1637158128002?e=1687996800&v=beta&t=1rdNgdmGxkEg3ov_MHb9NovN4Us3gaIskAcWbaP38dw',
      photoAlt: 'Photo de Anais Tailhade responsable de support',
      fullname: 'Anais Tailhade',
      role: 'Responsable de support',
    },
  ];

  return (
    <div>
      <Meta noIndex title="Équipe de l'Annuaire des Entreprises"></Meta>
      <TextWrapper>
        <h1>Une équipe au service du projet</h1>

        <p>Notre équipe est composée :</p>

        <ul>
          <li>D’un intrapreneur chargé de piloter le projet</li>
          <li>D’un développeur</li>
          <li>D’une data engineer</li>
          <li>De deux chargés de déploiement et de communication</li>
          <li>D’une responsable de support</li>
          <li>D’un UX designer</li>
        </ul>

        <p>
          Intégrée au sein de la{' '}
          <a href="https://www.numerique.gouv.fr/dinum/">DINUM</a> (Direction
          interministérielle du numérique) notre équipe s’appuie également sur
          le savoir faire de{' '}
          <a href="https://www.data.gouv.fr/fr/">data.gouv</a>, d
          <a href="https://api.gouv.fr/">’api.gouv</a> et d’
          <a href="https://www.etalab.gouv.fr/">Etalab</a>.
        </p>

        <p>
          La proximité avec ces services numériques d’excellence permettent de
          faciliter le développement de l’Annuaire des Entreprises au quotidien.
        </p>

        <p>
          Plus d’informations sur l’équipe et le projet{' '}
          <a href="https://beta.gouv.fr/startups/annuaire-entreprises.html">
            ici
          </a>
          .
        </p>

        <h1>Une méthode centrée sur l’agilité</h1>

        <p>
          L’Annuaire des Entreprises est un site de l’Etat qui s’inspire des{' '}
          <a href="https://beta.gouv.fr/manifeste">méthodes agiles</a>{' '}
          développées au sein de <a href="https://beta.gouv.fr/">Beta.gouv</a>.
        </p>

        <p>
          La logique de cette méthode est de savoir ajuster les solutions
          proposées aux besoins réels des utilisateurs.
        </p>

        <p>
          Il se peut que certaines fonctionnalités soient testées et ne
          correspondent pas aux attentes, elles sont alors supprimées, dans une
          logique de recherche de performance qui accepte l’erreur comme une
          tentative et non comme une fatalité.
        </p>

        <p>
          Par ailleurs, l’Annuaire des Entreprises valorise les partenariats
          avec d’autres administrations publiques ou privées avec une mission de
          service public, n’hésitez donc pas à nous contacter !
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
          <li>
            Mettre en cohérence les différentes données publiques, actuellement
            dispersées au sein des administrations françaises
          </li>
          <li>
            Participer à une meilleure transparence de l’information publique
            ouverte (logique d&quot;open data, de données ouvertes)
          </li>
        </ul>
        <h2>Ce que l’Annuaire des Entreprises ne fait pas</h2>
        <ul>
          <li>
            Proposer des outils d’intelligence économique (surveillance, alerte
            mail, enrichissement de CRM)
          </li>
          <li>
            Effectuer une correction sur une informations affichée (pour une
            entreprise, passez par{' '}
            <a href="https://formalites.entreprises.gouv.fr">
              le site de formalités des entreprises de l’INPI
            </a>
            , pour une association préférrez le compte asso)
          </li>
          <li>Informer sur des informations non affichées</li>
        </ul>
        <h2>Ce que l’Annuaire des Entreprises fait</h2>
        <ul>
          <li>
            Afficher les informations légales et publiques dont dispose
            l’administration les plus à jour
          </li>
          <li>
            Centraliser les informations, les croiser et les rendre accessibles
          </li>
          <li>Informer sur les données affichées</li>
        </ul>
        <h2>L&apos;équipe Annuaire des Entreprises</h2>
        <div className="team-members">
          {team.map((member) => (
            <div className="team-member" key={member.fullname}>
              <img src={member.photoUrl} alt={member.photoAlt} />
              <h3>{member.fullname}</h3>
              <p className="fr-text--sm">{member.role}</p>
            </div>
          ))}
        </div>
      </TextWrapper>
      <style jsx>{`
        .team-members {
          margin-top: 40px;
          display: flex;
          width: 100%;
          flex-wrap: wrap;
        }

        .team-member {
          text-align: center;
          width: 200px;
        }

        .team-member img {
          width: 90px;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Equipe;
