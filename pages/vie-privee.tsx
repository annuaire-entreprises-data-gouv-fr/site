import TextWrapper from '#components-ui/text-wrapper';
import { DILA, INPI, INSEE } from '#components/administrations';
import Meta from '#components/meta';
import { NextPageWithLayout } from './_app';

const Privacy: NextPageWithLayout = () => (
  <div>
    <Meta noIndex title="Politique de confidentialité" />
    <TextWrapper>
      <h1>Politique de confidentialité</h1>
      <p>
        La DINUM est responsable de traitement de données à caractère personnel
        réalisés par l’Annuaire des Entreprises. Elle s’engage à assurer un
        traitement de ces données conforme au Règlement (UE) 2016/679 relatif à
        la protection des données à caractère personnel et à la libre
        circulation de ces données et à la loi n° 78-17 du 6 janvier 1978
        relative à l’informatique aux fichiers et aux libertés.
      </p>
      <h2>Données à caractère personnel traitées</h2>
      <p>
        Ne sont traitées que les données strictement nécessaires au
        fonctionnement du service. Ces données ne pourront en aucun cas servir
        au contrôle et à la surveillance de l’activité des Utilisateurs et
        Utilisatrices. Les données à caractère personnel concernées sont les
        suivantes :
        <ul>
          <li>
            Données relatives aux dirigeants : prénoms, nom, lieu et mois de
            naissance, adresse postale; (organisme qui produit les données :{' '}
            <INSEE />, <DILA />, <INPI />)
          </li>
          <li>
            Données relatives aux bénéficiaires effectifs : prénoms, nom,
            prénoms, date de naissance et nationalité; (organisme qui produit
            les données : <INPI />)
          </li>
          <li>
            Données relatives aux agents publics : nom, prénom, adresse e-mail.
          </li>
          <li>
            Données relatives aux personnes physiques qui s’opposent au
            traitement de leurs données identifiantes : nom, prénom, lieu et
            date de naissance.
          </li>
        </ul>
      </p>
      <p>
        La présente politique de confidentialité informe les personnes
        concernées sur le traitement de données à caractère personnel sur
        Annuaire des Entreprises et notamment sur{' '}
        <a href="https://api.gouv.fr/les-api/api-recherche-entreprises">
          API Recherche d’entreprises
        </a>
        .
      </p>
      <p>
        Effectivement, certaines données du RGE ou relatives aux associations
        par exemple peuvent être traitées par le biais d’
        <a href="https://api.gouv.fr/les-api/api-recherche-entreprises">
          API Recherche d’entreprises
        </a>{' '}
        sans qu’elles soient nécessaires au traitement : notamment l’adresse
        postale du fondateur de l’association lorsqu’il n’y a pas de siège
        social ou des adresses e-mail et numéros de téléphone de contact.{' '}
      </p>
      <h2>Finalités</h2>
      <p>
        Les traitements ont pour finalités la mise à disposition des données
        publiques détenues par l’administration sur les entreprises ou les
        associations et en particulier les données contenues dans un extrait
        d’immatriculation d’entreprise (également appelé extrait KBIS ou extrait
        D1).
      </p>
      <h2>Base légale</h2>
      <p>
        Les données à caractère personnel susvisées sont traitées par le biais
        de l’exécution d’une mission d’intérêt public ou relevant de l’exercice
        de l’autorité publique dont est investi le responsable de traitement au
        sens de l’article 6-1 e) du RGPD.
      </p>
      <p>
        Cette mission d’intérêt public est mise en œuvre par le décret n°
        2019-1088 du 25 octobre 2019 relatif au système d’information et de
        communication de l’Etat et à la direction interministérielle du
        numérique.
      </p>
      <h2>Durées de conservation</h2>
      <div className="fr-table">
        <table>
          <caption>
            Résumé des différentes durées de conservation des données
          </caption>
          <thead>
            <tr>
              <th>Catégories de données</th>
              <th>Durée de conservation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Données relatives aux dirigeants</td>
              <td>
                Les données sont accessibles via API, elles sont supprimées des
                serveurs au bout d’une dizaine de minute. <br />
                Les données des dirigeants accessibles depuis l’API Recherche
                d’entreprises sont conservées indéfiniment sur l’API et sont
                réactualisées tous les jours.
              </td>
            </tr>
            <tr>
              <td>Données relatives aux bénéficiaires effectifs</td>
              <td>
                Les données sont accessibles via API, elles sont supprimées des
                serveurs au bout d’une dizaine de minute.
              </td>
            </tr>
            <tr>
              <td>Données relatives aux agents publics</td>
              <td>
                Les données sont accessibles via API, elles sont supprimées des
                serveurs au bout d’une dizaine de minute.
              </td>
            </tr>
            <tr>
              <td>Données relatives aux personnes physiques qui s’opposent </td>
              <td>
                Les données sont supprimées dès la mise en œuvre de
                l’opposition.
              </td>
            </tr>
            <tr>
              <td>Cookies</td>
              <td>Les cookies ne sont pas conservés sur le serveur.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>Destinataires</h2>
      <p>
        Les données traitées par le service sont des données publiques mises à
        disposition du public, des entreprises et des administrations.
      </p>
      <h2>Sous-traitants</h2>
      <p>
        Certaines données sont envoyées à des sous-traitants. Le responsable de
        traitement s’est assuré de la mise en œuvre par ses sous-traitants de
        garanties adéquates et du respect de conditions strictes de
        confidentialité, d’usage et de protection des données.
      </p>
      <div className="fr-table">
        <table>
          <caption>Résumé des différents sous-traitants</caption>
          <thead>
            <tr>
              <th>Partenaire</th>
              <th>Traitement réalisé</th>
              <th>Pays destinataire</th>
              <th>Garanties</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>OVH</td>
              <td>Hébergement</td>
              <td>France</td>
              <td>https://www.ovh.com/fr/protection-donnees-personnelles/</td>
            </tr>
            <tr>
              <td>Scalingo</td>
              <td>Hébergement de test</td>
              <td>France</td>
              <td>
                https://scalingo.com/fr/contrat-gestion-traitements-donnees-personnelles
              </td>
            </tr>
            <tr>
              <td>Matomo</td>
              <td>Mesure d’audience</td>
              <td>France</td>
              <td>https://fr.matomo.org/matomo-cloud-dpa/</td>
            </tr>
            <tr>
              <td>Sentry</td>
              <td>Tracking d’erreurs</td>
              <td>Union Européenne</td>
              <td>https://sentry.io/legal/dpa/</td>
            </tr>
            <tr>
              <td>Nginix Amplify</td>
              <td>Monitoring</td>
              <td>Union Européenne</td>
              <td>https://www.f5.com/company/policies/privacy-notice</td>
            </tr>
            <tr>
              <td>Zammad</td>
              <td>Support</td>
              <td>Union Européenne</td>
              <td>https://zammad.com/en/company/privacy</td>
            </tr>
            <tr>
              <td>Github</td>
              <td>Hébergement du code</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Notion</td>
              <td>Gestion des connaissances</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Tchap</td>
              <td>Outil de collaboration</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Mattermost</td>
              <td>Outil de collaboration</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Grist</td>
              <td>Gestion des connaissances</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>Cookies</h2>
      Le site dépose des cookies de mesure d’audience (nombre de visites, pages
      consultées), respectant les conditions d’exemption du consentement de
      l’internaute définies par la recommandation « Cookies » de la Commission
      nationale informatique et libertés (CNIL). Cela signifie, notamment, que
      ces cookies ne servent qu’à la production de statistiques anonymes et ne
      permettent pas de suivre la navigation de l’internaute sur d’autres sites.
      <p>
        Nous utilisons pour cela{' '}
        <a href="https://matomo.org/" rel="noopener noreferrer" target="_blank">
          Matomo
        </a>
        , un outil{' '}
        <a
          href="https://matomo.org/free-software/"
          rel="noopener noreferrer"
          target="_blank"
        >
          libre
        </a>
        , paramétré pour être en conformité avec la{' '}
        <a
          href="https://www.cnil.fr/fr/solutions-pour-les-cookies-de-mesure-daudience"
          rel="noopener noreferrer"
          target="_blank"
        >
          recommandation « Cookies »
        </a>{' '}
        de la{' '}
        <abbr title="Commission Nationale de l’Informatique et des Libertés">
          CNIL
        </abbr>
        . Cela signifie que votre adresse IP, par exemple, est anonymisée avant
        d’être enregistrée. Il est donc impossible d’associer vos visites sur ce
        site à votre personne.
      </p>
      <p>
        Il convient d’indiquer que : Les données collectées ne sont pas
        recoupées avec d’autres traitements. Les cookies ne permettent pas de
        suivre la navigation de l’internaute sur d’autres sites.
      </p>
      <p>
        À tout moment, vous pouvez refuser l’utilisation des cookies et
        désactiver le dépôt sur votre ordinateur en utilisant la fonction dédiée
        de votre navigateur (fonction disponible notamment sur Microsoft
        Internet Explorer 11, Google Chrome, Mozilla Firefox, Apple Safari et
        Opera).
      </p>
      <p>
        Pour l’outil Matomo, vous pouvez décider de ne jamais être suivi, y
        compris anonymement :
        <iframe
          className="matomo-optout"
          title="Optout cookie"
          src="https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=fr&backgroundColor=&fontColor=333&fontSize=16px&fontFamily=sans-serif&overflow=visible"
        ></iframe>
      </p>
      <p>
        Pour aller plus loin, vous pouvez consulter les fiches proposées par la{' '}
        <abbr title="Commission Nationale de l’Informatique et des Libertés">
          CNIL
        </abbr>{' '}
        :
      </p>
      <ul>
        <li>
          <a
            href="https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi"
            rel="noopener noreferrer"
            target="_blank"
          >
            Cookies et traceurs : que dit la loi ?
          </a>
        </li>
        <li>
          <a
            href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser"
            rel="noopener noreferrer"
            target="_blank"
          >
            Cookies : les outils pour les maîtriser
          </a>
        </li>
      </ul>
      <p>
        Annuaire-entreprises utilise également des cookies strictement
        nécessaires au bon fonctionnement de l’Application sans lesquels l’accès
        à la plateforme ne peut être pleinement garanti.{' '}
      </p>
      <h2>
        Exercice des droits à la protection des données à caractère personnel
      </h2>
      <p>
        Vous disposez d’un droit d’accès et de modification des données à
        caractère personnel qui vous concernent. Vous pouvez également vous
        opposer aux traitements réalisés par l’Annuaire des Entreprises.
      </p>
      <p>
        Vos droits d’accès et d’opposition s’exercent auprès de la DINUM à
        l’adresse{' '}
        <a href="mailto:annuaire-entreprises@data.gouv.fr">
          annuaire-entreprises@data.gouv.fr
        </a>{' '}
        ou par courrier à l’adresse suivante :
        <ul>
          <li>DINUM, A l’attention d’annuaire-entreprises</li>
          <li>20 avenue de Ségur 75007 Paris</li>
        </ul>
      </p>
      <p>
        Si vous vous opposez au traitement de vos données à caractère personnel,
        celles-ci ne seront plus diffusées en open data dans la rubrique
        « dirigeants » de votre entreprise. Elles resteront cependant
        accessibles sur demande aux administrations qui ont besoin d’en
        connaître dans le cadre de leurs missions.
      </p>
      <p>
        Pour exercer votre droit de modification, nous vous invitons à vous
        rapprocher des organismes qui ont produit ces données.
        <ul>
          <li>
            l’
            <INSEE /> (Institut national de la statistique et des études
            économiques)
          </li>
          <li>
            l’
            <INPI /> (Institut national de la propriété industrielle)
          </li>
          <li>
            la <DILA /> (Direction de l’information légale et administrative)
          </li>
        </ul>
      </p>
      <p>
        Pour exercer vos droits, vous pouvez également contacter le délégué à la
        protection des données (DPD) des services du Premier Ministre : par mail
        à <a href="mailto:dpd@pm.gouv.fr">dpd@pm.gouv.fr</a>
        ou par courrier à l’adresse suivante :
        <ul>
          <li>
            Services du Premier Ministre À l’attention du délégué à la
            protection des données (DPD)
          </li>
          <li>56 rue de Varenne 75007 Paris</li>
        </ul>
        Conformément au règlement général sur la protection des données, vous
        disposez du droit d’introduire une réclamation auprès de la CNIL (3
        place de Fontenoy – TSA 80715 – 75334 PARIS CEDEX 07).
        <br />
        Les modalités de réclamation sont précisées sur le site de la CNIL :{' '}
        <a href="https://www.cnil.fr">www.cnil.fr</a>.
      </p>
      <h2>Contact</h2>
      <p>
        L’adresse mail de contact est la suivante :
        <a href="mailto:annuaire-entreprises@data.gouv.fr">
          annuaire-entreprises@data.gouv.fr
        </a>
        .
      </p>
    </TextWrapper>
    <style jsx>{`
      .matomo-optout {
        overflow: visible;
        border-width: 0;
        width: 100%;
      }
    `}</style>
  </div>
);

export default Privacy;
