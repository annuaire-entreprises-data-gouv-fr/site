import { Metadata } from 'next';
import TextWrapper from '#components-ui/text-wrapper';

export const metadata: Metadata = {
  title: 'Votre navigateur est trop ancien',
};

export default function OutdatedBrowser() {
  return (
    <>
      <h1>🕯️ Votre navigateur est trop ancien 🕯️</h1>
      <TextWrapper>
        <p>
          Ce site web ne peut pas fonctionner correctement car{' '}
          <strong>la version de votre navigateur est trop ancienne</strong>.
          Merci de le mettre à jour ou de télécharger la version actualisée de
          l’un de ces navigateurs gratuits :
        </p>
        <ul>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.mozilla.com/firefox/"
            >
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.opera.com/fr"
            >
              Opera
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.google.com/chrome?hl=fr"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.microsoft.com/fr-fr/windows/microsoft-edge"
            >
              Microsoft Edge
            </a>
          </li>
        </ul>
        <p>
          Pourquoi est-ce important d’utiliser un navigateur récent / à jour ?
        </p>
        <ul>
          <li>
            Un navigateur à jour est mieux <strong>sécurisé</strong> contre les
            virus, les tentatives d’hameconnage et les arnaques.
          </li>
          <li>
            Un navigateur à jour est plus <strong>rapide</strong> et plus
            confortable.
          </li>
          <li>
            Un navigateur à jour est{' '}
            <strong>compatible avec tous les sites webs</strong> (par exemple,
            sur ce site, les filtres de recherche ne fonctionnent pas avec un
            navigateur trop ancien).
          </li>
        </ul>
        <p>
          Si vous utilisez un ordinateur géré par un administrateur systèmes et
          que vous ne pouvez installer un nouveau navigateur,{' '}
          <strong>demandez à votre administrateur.</strong>
        </p>
      </TextWrapper>
    </>
  );
}
