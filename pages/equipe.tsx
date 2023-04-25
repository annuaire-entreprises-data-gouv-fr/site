import TextWrapper from '#components-ui/text-wrapper';
import Meta from '#components/meta';
import { NextPageWithLayout } from './_app';

const team = [
  {
    photoUrl:
      'https://media.licdn.com/dms/image/C5603AQGIAb1ihRg0ng/profile-displayphoto-shrink_400_400/0/1643020506289?e=1687996800&v=beta&t=iN937FiOIKwaWpSyLd2NOCFmTvM-yWn8dxj4o1_tT4o',
    fullname: 'Xavier Jouppe',
    role: 'Intrapreneur',
  },
  {
    photoUrl: 'https://avatars3.githubusercontent.com/haekadi?s=600',
    fullname: 'Hajar AIT EL KADI',
    role: 'Data engineer',
  },
  {
    photoUrl:
      'https://media.licdn.com/dms/image/C5603AQEVYzrMNeEk1A/profile-displayphoto-shrink_400_400/0/1571905688713?e=1687996800&v=beta&t=9FcktZgpPF3AQyjwUkyu_yrGhkw8_r4hmnf85L3xIs8',
    fullname: 'Yoan Ficadiere',
    role: 'Développeur',
  },
  {
    photoUrl:
      'https://media.licdn.com/dms/image/C4E03AQFC-guw6_nQew/profile-displayphoto-shrink_400_400/0/1517369358753?e=1687996800&v=beta&t=Ij9LlxFEFueOo_8NWMVuiOkYW-Mm2kiVlJSHqOXcO_I',
    fullname: 'Jonathan Louis',
    role: 'Chargé de déploiement SEO',
  },
  {
    photoUrl:
      'https://media.licdn.com/dms/image/C4E03AQETVFgZWggrCg/profile-displayphoto-shrink_400_400/0/1525470173766?e=1687996800&v=beta&t=jVgQwkB7rFz5262tZko1HX04lWHBhWQVyTzh3yXf5Lw',
    fullname: 'Karen Mazmanian',
    role: 'Chargé de déploiement et de communication',
  },
  {
    photoUrl:
      'https://media.licdn.com/dms/image/C4D03AQEqDf6tgafatQ/profile-displayphoto-shrink_800_800/0/1637158128002?e=1687996800&v=beta&t=1rdNgdmGxkEg3ov_MHb9NovN4Us3gaIskAcWbaP38dw',
    fullname: 'Anais Tailhade',
    role: 'Responsable du support utilisateur',
  },
  {
    photoUrl: 
      'https://media.licdn.com/dms/image/C4E03AQHzG-_DEKHuAw/profile-displayphoto-shrink_400_400/0/1580212866105?e=1687996800&v=beta&t=9SPkCg8ekw_2M2DQK8htFrkX0t7z_oZV75I-tUBjbbw',
    fullname: 'Jérémie Cook',
    role: 'UX Designer',
  }
];

const Equipe: NextPageWithLayout = () => {
  return (
    <div>
      <Meta noIndex title="Équipe de l'Annuaire des Entreprises"></Meta>
      <TextWrapper>
        <h1>Qui sommes-nous ?</h1>
        <h2>Qui construit l’Annuaire des Entreprises ?</h2>
        <p>
          Ce site public est développé et maintenu par la Direction
          interministérielle du numérique{' '}
          <a
            href="https://www.numerique.gouv.fr/dinum/"
            target="_blank"
            rel="noreferrer"
          >
            (DINUM)
          </a>
          , en coopération avec la{' '}
          <a
            href="https://entreprises.gouv.fr/"
            target="_blank"
            rel="noreferrer"
          >
            Direction Générale des Entreprises (DGE)
          </a>{' '}
          et les{' '}
          <a href="/donnees/sources">
            administrations qui fournissent la donnée
          </a>
          .
        </p>
        <p>
          L’Annuaire des Entreprises ne{' '}
          <b>
            fait que centraliser les données. Il ne les modifie pas et ne les
            stocke pas.
          </b>
        </p>

        <h2>Notre méthode</h2>
        <p>
          L’Annuaire des Entreprises est un site de l’Etat qui s’inspire des{' '}
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
            ouverte (logique d&quot;open data, de données ouvertes)
          </li>
        </ul>

        <h2>Ce que nous ne faisons pas</h2>
        <ul>
          <li>
            Proposer des outils d’intelligence économique (surveillance, alerte
            mail, enrichissement de CRM)
          </li>
          <li>
            Effectuer une correction sur une informations affichée (pour une
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
          <li>un intrapreneur chargé de piloter le projet</li>
          <li>un développeur</li>
          <li>une data engineer</li>
          <li>deux chargés de déploiement et de communication</li>
          <li>une responsable de support</li>
          <li>un UX designer</li>
        </ul>
        <p>
          Plus d’informations{' '}
          <a href="https://beta.gouv.fr/startups/annuaire-entreprises.html">
            sur la page beta.gouv du projet
          </a>
          .
        </p>
        <div className="team-members">
          {team.map((member) => (
            <div className="team-member" key={member.fullname}>
              <img
                src={member.photoUrl}
                alt={`Photo de ${member.fullname} - ${member.role}`}
                title={`Photo de ${member.fullname} - ${member.role}`}
              />
            </div>
          ))}
        </div>
      </TextWrapper>
      <style jsx>{`
        .team-members {
          margin: 60px auto;
          display: flex;
          justify-content: center;
          width: 100%;
          flex-wrap: wrap;
        }

        .team-member {
          text-align: center;
          width: 80px;
        }

        .team-member img {
          width: 100px;
          border-radius: 50%;
          border: 5px solid #fff;
        }
      `}</style>
    </div>
  );
};

export default Equipe;
