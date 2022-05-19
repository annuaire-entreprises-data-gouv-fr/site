import React from 'react';
import Page from '../../layouts';
import { qrCode } from '../../components/icon';

const Partager: React.FC = () => {
  return (
    <Page
      small={true}
      title="Réutiliser ou partager l’Annuaire des Entreprises"
    >
      <div className="content-container text-wrapper">
        <h1>Réutilisations & partage</h1>
        <p>Table des matières</p>
        <ul>
          <li>
            <a href="#link">
              Ajouter un lien vers une fiche entreprise sur son site web
            </a>
          </li>
          <li>
            <a href="#qr">Générer un QR code vers une fiche entreprise</a>
          </li>
          {/* <li>
            <a href="#search">
              Ajouter le moteur de recherche des entreprises sur son site web
            </a>
          </li> */}
        </ul>
        <div>
          <h2 id="link">
            Ajouter un lien vers une fiche entreprise sur son site web
          </h2>
          <h3>Quand l’utiliser ?</h3>
          <p>
            En ajoutant un lien cliquable depuis un site web (site officiel
            d’une entreprise, annuaire d’entreprises etc.), n’importe quel
            visiteur peut retrouver rapidement les informations essentielles de
            l’entreprise.
          </p>
          <p>Le lien est disponible en deux couleurs :</p>
          <iframe
            width="290"
            height="70"
            style={{ border: 'none', maxWidth: '100%' }}
            src="https://annuaire-entreprises.data.gouv.fr/api/share/button/510973431"
          ></iframe>
          <div />
          <iframe
            width="290"
            height="70"
            style={{ border: 'none', maxWidth: '100%' }}
            src="https://annuaire-entreprises.data.gouv.fr/api/share/button/510973431?light=true"
          ></iframe>
          <h3>Comment ajouter un lien sur mon site ?</h3>
          <p>
            Il vous suffit d’intégrer l’iframe suivante sur votre site web, à
            l’endroit où vous voulez faire apparaitre le lien.
          </p>
          <p>
            Couleur bleu foncé :
            <code>
              {`
<iframe
  width="290"
  height="100"
  style={ border: none; max-width: 100%; }
  src="https://annuaire-entreprises.data.gouv.fr/api/share/button/<SIREN_OR_SIRET>"
></iframe>
                  `}
            </code>
          </p>
          <p>
            Couleur blanc :
            <code>
              {`
<iframe
  width="290"
  height="100"
  style={ border: none; max-width: 100%; }
  src="https://annuaire-entreprises.data.gouv.fr/api/share/button/<SIREN_OR_SIRET>?light=true"
></iframe>
                  `}
            </code>
          </p>
          <p>
            <b>Attention :</b> pensez bien a renseigner{' '}
            <code>SIREN_OR_SIRET</code> avec le siren ou le siret pour lequel
            vous voulez créer un lien !
          </p>
          <h2 id="qr">Générer un QR code vers une fiche entreprise</h2>
          <h3>Quand l’utiliser ?</h3>
          <p>
            En ajoutant un QR code sur un document papier (facture, courier
            etc.), n’importe qui peut retrouver la fiche d’une entreprise en
            prenant en photo et en scannant le lien.
          </p>
          <p>Voici un exemple de QR code :</p>
          <img alt="exemple de QR code" src="/images/QR_code_example.jpeg" />
          <h3>Comment générer un QR code ?</h3>
          <p>
            Vous pouvez générer un lien{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://fr.wikipedia.org/wiki/Code_QR"
            >
              QR code
            </a>
            , scannable par téléphone, <b>depuis chaque fiche entreprise</b> :
            <ul>
              <li>
                Allez sur le <a href="/">moteur de recherche</a>
              </li>
              <li>Trouvez l’entreprise et accédez à sa fiche</li>
              <li>
                Cliquez en haut à droite de la page, sur le petit logo{' '}
                <span>{qrCode}</span>
              </li>
            </ul>
          </p>
          {/* <h2 id="search">
            Ajouter le moteur de recherche des entreprises sur son site web
          </h2>
          <h3>Quand l’utiliser ?</h3>
          <p></p>
          <h3>Comment faire ?</h3>
          <p></p> */}
        </div>
      </div>
    </Page>
  );
};

export default Partager;
