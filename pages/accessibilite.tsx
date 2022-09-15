import React from 'react';
import TextWrapper from '../components-ui/text-wrapper';

import Page from '../layouts';
import constants from '../models/constants';

const Accessibility: React.FC = () => {
  return (
    <Page small={true} title="Déclaration d’accessibilité" noIndex={true}>
      <TextWrapper>
        <h1>Déclaration d’accessibilité</h1>
        <p>
          La DINUM s’engage à rendre son service accessible, conformément à
          l’article 47 de la loi n° 2005-102 du 11 février 2005.
          <br />À cette fin, nous mettons en œuvre la stratégie et les actions
          suivantes :{' '}
          <a href="https://www.numerique.gouv.fr/uploads/DINUM_SchemaPluriannuel_2020.pdf">
            Télécharger le schéma pluriannuel de la DINUM au format PDF.
          </a>
          <br />
          Cette déclaration d’accessibilité s’applique à
          annuaire-entreprises.data.gouv.fr.
        </p>
        <h2>État de conformité</h2>
        <p>
          annuaire-entreprises.data.gouv.fr est non conforme avec le RGAA 4.1.
          <br />
          Le site n’a pas encore été audité.{' '}
        </p>
        <h2>Établissement de cette déclaration d’accessibilité</h2>
        <p>Cette déclaration a été établie le 23 mars 2021.</p>

        <h2>Amélioration et contact</h2>
        <p>
          Si vous n’arrivez pas à accéder à un contenu ou à un service, vous
          pouvez contacter le responsable de annuaire-entreprises.data.gouv.fr
          pour être orienté vers une alternative accessible ou obtenir le
          contenu sous une autre forme.
        </p>
        <ul>
          <li>
            Écrivez-nous à{' '}
            <a href={constants.links.mailto}>{constants.links.mail}</a>
          </li>
          <li>Adresse : DINUM 20 avenue de Ségur 75007 Paris</li>
        </ul>
        <p>Nous essayons de répondre dans les 2 jours ouvrés.</p>
        <h2>Voie de recours</h2>
        <p>
          Cette procédure est à utiliser dans le cas suivant : vous avez signalé
          au responsable du site internet un défaut d’accessibilité qui vous
          empêche d’accéder à un contenu ou à un des services du portail et vous
          n’avez pas obtenu de réponse satisfaisante.
          <br />
          <p>Vous pouvez :</p>
          <ul>
            <li>Écrire un message au Défenseur des droits</li>
            <li>
              Contacter le délégué du Défenseur des droits dans votre région
            </li>
            <li>
              Envoyer un courrier par la poste (gratuit, ne pas mettre de
              timbre) : Défenseur des droits Libre réponse 71120 75342 Paris
              CEDEX 07
            </li>
          </ul>
        </p>
      </TextWrapper>
    </Page>
  );
};

export default Accessibility;
