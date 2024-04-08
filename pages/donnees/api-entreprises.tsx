import { DINUM, INPI, INSEE } from '#components/administrations';
import Meta from '#components/meta/meta-client';

const AccesByAPIPage = () => (
  <>
    <Meta
      title="API Recherche d’entreprises & API Entreprise"
      noIndex={false}
      canonical="https://annuaire-entreprises.data.gouv.fr/donnees/acceder-par-api"
    />
    <div className="content-container">
      <h1>API Recherche d’entreprises & API Entreprise</h1>
      <p>
        Dans le cadre du{' '}
        <a href="https://commission.europa.eu/news/once-only-principle-system-breakthrough-eus-digital-single-market-2020-11-05_en">
          Dites-Le-Nous-Une-Fois
        </a>
        , la <DINUM /> propose deux API pour accéder aux données détenues par
        les administrations sur une entreprise française : l’
        <strong>API Recherche d’entreprise</strong> et l’
        <strong>API Entreprise</strong>.
      </p>
      <h2>L’API Recherche d’entreprise</h2>
      <p>
        C’est l’API qui alimente le moteur de recherche de l’Annuaire des
        Entreprises. Elle fait une synthèse des différentes bases de données
        existantes dans l’administration française (en particulier le Registre
        National des Entreprises (RNE) et la base Sirene). Elle permet d’accéder
        aux principales données ouvertes des entreprises françaises. Elle
        contient par exemple les données de la{' '}
        <a href="/rechercher?terme=edf">page de recherche</a> et celles de la{' '}
        <a href="/entreprise/electricite-de-france-edf-552081317">
          fiche résumé
        </a>
        .
      </p>
      <ul>
        <li>Conditions d’accès : API ouverte</li>
        <li>
          <a href="https://api.gouv.fr/les-api/api-recherche-entreprises">
            Page officielle
          </a>
        </li>
        <li>
          <a href="https://recherche-entreprises.api.gouv.fr/docs/">
            Documentation (OpenAPI)
          </a>
        </li>
      </ul>
      <p>
        <strong>Attention,</strong> cette API{' '}
        <strong>ne donne pas accès à toutes les données</strong> affichées sur
        l’Annuaire des Entreprises. En effet, dès que c’est possible, le site
        utilise les API fournies par les{' '}
        <a href="/administration">administrations compétentes</a>.
        <br />
      </p>
      <p>
        La liste des données et des API utilisées par le site est disponible sur
        la page <a href="/donnees/sources">source de données</a>.
      </p>
      <h2>L’API Entreprise</h2>
      <p>
        C’est l’API qui permet{' '}
        <strong>
          aux services publics (administrations centrales, collecitvités,
          services déconcentrés etc.)
        </strong>{' '}
        d’échanger entre eux les <strong>données restreintes</strong> des
        entreprises françaises.
        <br />
        Par définition elle est réservée aux administrations et nécessite un
        haut niveau d’habilitation. Ses données sont accessibles sur l’Annuaires
        des Entrepirses, uniquement <strong>aux agents publics</strong>. Pour en
        savoir plus,{' '}
        <a href="/lp/agent-public">découvrez l’espace agent public</a>.
      </p>
      <ul>
        <li>
          Conditions d’accès :{' '}
          <a href="https://api.gouv.fr/les-api/api-entreprise/demande-acces">
            API sous habilitation
          </a>
        </li>
        <li>
          <a href="https://entreprise.api.gouv.fr/">Page officielle</a>
        </li>
        <li>
          <a href="https://entreprise.api.gouv.fr/developpeurs">
            Documentation
          </a>
        </li>
      </ul>
      <h2>Les API entreprises, en dehors de la DINUM</h2>
      <p>
        En dehors de ces deux API, chaque administration propose des{' '}
        <a href="https://api.gouv.fr">API pour accéder à ses données</a>. En
        particulier, il existe deux API pour accéder aux deux principales bases
        de données d’entreprises :
      </p>
      <ul>
        <li>
          l’<a href="https://api.gouv.fr/les-api/sirene_v3">API Sirene</a> de l’
          <INSEE />, pour accéder au répertoire Sirene.
        </li>
        <li>
          l’
          <a href="https://data.inpi.fr/content/editorial/Acces_API_Entreprises">
            API RNE
          </a>{' '}
          de l’
          <INPI />, pour accéder au Registre National des Entreprises.
        </li>
      </ul>
      <h2>Comparaison entre les différentes API disponibles</h2>
      <p>
        Afin d’y voir un peu plus clair, voici une comparaison entre les
        principales API citées sur cette page (Sirene, RNE, API Recherche
        entreprise, API Entreprise) :
      </p>
      <div className="fr-table">
        <table>
          <thead>
            <tr>
              <th scope="col">Nom</th> <th scope="col">Administration</th>
              <th scope="col">Conditions d’accès</th>
              <th scope="col">Quota d’appels</th>
              <th scope="col">Sources de donnée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>API Recherche d’entreprises</td> <td>DINUM</td>{' '}
              <td>100% ouverte</td> <td>400 appels/min/IP</td>
              <td>RNE, Sirene, IDCC, Ratios financiers etc.</td>
            </tr>
            <tr>
              <td>API Entreprise</td> <td>DINUM</td>{' '}
              <td>Réservée à l’administration</td> <td>500 appels/min/IP</td>
              <td>
                <a href="https://entreprise.api.gouv.fr/catalogue">
                  Consulter la liste
                </a>
              </td>
            </tr>
            <tr>
              <td>API RNE</td> <td>INPI</td> <td>Création de compte</td>{' '}
              <td>15 000 appels/jours/IP</td>
              <td>RNE</td>
            </tr>
            <tr>
              <td>API Sirene</td> <td>INSEE</td> <td>Création de compte</td>{' '}
              <td>30 appels/min/IP</td>
              <td>Sirene</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </>
);

export default AccesByAPIPage;
