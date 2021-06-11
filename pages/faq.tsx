import constants from '../constants';
import React, { PropsWithChildren } from 'react';
import ButtonLink from '../components/button';

import Page from '../layouts';
import NonDiffusible from '../components/non-diffusible';

const QuestionBlock: React.FC<PropsWithChildren<{ title: string }>> = ({
  children,
  title,
}) => {
  const id = Math.random().toString(16).substring(7);
  return (
    <>
      <div className="container">
        <input
          type="checkbox"
          value="selected"
          id={id}
          className="toggle__input"
        />
        <label htmlFor={id}>{title}</label>
        <div>{children}</div>
      </div>

      <style jsx>{`
        div.container > div {
          max-height: 0;
          overflow: hidden;
          transition: max-height 150ms ease-in-out, padding 150ms ease-in-out;
          background-color: #f3f3f3;
          border-radius: 2px;
          padding: 0 15px 15px;
          display: block;
          margin-bottom: 15px;
        }

        label {
          display: block;
          font-weight: bold;
          font-size: 1.2rem;
          line-height: 1.6rem;
          padding: 10px 0;
          cursor: pointer;
          position: relative;
          margin-right: 25px;
        }
        label:after {
          content: '▾';
          position: absolute;
          color: #000091;
          right: -25px;
          top: 20px;
          transition: transform 200ms ease-in-out;
        }

        .toggle__input {
          display: none;
        }
        .toggle__input:checked ~ div {
          max-height: 500px;
        }
        .toggle__input:checked ~ label:after {
          transform: rotate(-180deg);
        }
        .toggle__input:not(:checked) ~ div {
          max-height: 0;
          padding: 0 15px;
        }
        .toggle__input:not(:checked) ~ label:after {
          transform: rotate(0deg);
        }

        @media only screen and (min-width: 1px) and (max-width: 600px) {
          label {
            padding: 10px 0;
            font-size: 1.2rem;
            line-height: 1.6rem;
          }
        }
      `}</style>
    </>
  );
};

const FAQ: React.FC<{}> = () => (
  <Page small={true} title="FAQ de l’Annuaire des Entreprises">
    <div className="content-container text-wrapper">
      <h1>FAQ</h1>
      <p>Conseils et réponses de l'équipe Annuaire des Entreprises</p>
      <div className="questions">
        <QuestionBlock title="Je cherche une entreprise qui n'apparait pas dans les résultats de recherche">
          <p>
            Il existe plusieurs raisons pour lesquelles une entreprise peut ne
            pas apparaitre dans les résultats de recherche :
          </p>
          <ul>
            <li>
              Vous avez pu faire une faute de frappe en tapant le nom de
              l'entreprise.
            </li>
            <li>
              Si l'entreprise est récente, les données peuvent ne pas encore
              être à jour (les données du moteur de recherche sont mises à jour
              tous les mois)
            </li>
            <li>
              C'est une entreprise non-diffusible (voir l’explication
              ci-dessous)
            </li>
          </ul>
        </QuestionBlock>
        <QuestionBlock title="Pourquoi mon adresse personnelle apparait-elle sur l'Annuaire des Entreprises ?">
          <p>
            Les pages des entreprises individuelles et des auto-entreprises,
            sont susceptibles de contenir des informations à caractère
            personnel. Dans le cadre de l’article{' '}
            <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031043097/">
              A123-96 du code de Commerce
            </a>
            , chaque personne physique inscrite au répertoire Sirene comme
            entrepreneur individuel peut choisir de rendre publiques ou non les
            données qui la concernent.
          </p>
          <p>
            La procédure s'appelle "changement de statut de diffusion" et elle
            est à effectuer auprès de L'INSEE :
          </p>
          <div className="layout-center">
            <ButtonLink href="https://statut-diffusion-sirene.insee.fr/" alt>
              ⇢ Changer le statut de diffusion de mon entreprise
            </ButtonLink>
          </div>
        </QuestionBlock>
        <QuestionBlock title="Qu'est-ce qu'une entreprise non-diffusible ?">
          <NonDiffusible />
        </QuestionBlock>
        <QuestionBlock title="Je suis un agent public et je cherche les données présentes dans un extrait KBIS/D1">
          <p>
            À partir de Novembre 2021, les entreprises immatriculées au RCS ou
            au RNM n’ont plus à fournir leur extrait KBIS dans leurs démarches
            administratives, le seul numéro siret suffit à l'administration pour
            retrouver les données nécessaire.
          </p>
          <p>
            Ce site permet aux agents d’administrations de retrouver{' '}
            <b>toutes les informations contenues dans un KBIS</b>.
          </p>
          <p>
            <a href="/donnees-extrait-kbis">
              ⇢ Pour en savoir plus, consultez notre guide.
            </a>
          </p>
        </QuestionBlock>
        <QuestionBlock title="La fiche d'immatriculation de mon entreprise est introuvable">
          <p>
            Les entreprises individuelles et les auto-entreprises, ne sont{' '}
            <b>pas obligées d'être immatriculées</b>. Il est donc possible que
            vous ne trouviez pas de fiche d'immatriculation pour une entreprise
            de ce type.
          </p>
          <p>
            En revanche, les entreprises de toutes les autres formes juridiques{' '}
            <b>doivent être immatriculées</b>. Si vous ne trouvez pas de fiche
            d'immatriculation pour une entreprise, deux choix s'offrent à vous :
          </p>
          <ul>
            <li>
              Si l'entreprise est une entreprise artisanale,{' '}
              <a href="https://rnm.artisanat.fr/">
                contactez les Chambres des Métiers de l‘Artisanat
              </a>
            </li>
            <li>
              Si l'entreprise n‘est pas une entreprise artisanale,{' '}
              <a href="http://data.inpi.fr/">
                contactez l‘INPI qui centralise les données des Greffes des
                tribuanux de commerce.
              </a>
            </li>
          </ul>
        </QuestionBlock>
        <QuestionBlock title="Quelle est la fréquence de mise à jour des données ?">
          <p>
            Les données du moteur de recherche sont mises à jour tous les mois.
          </p>
        </QuestionBlock>
        <QuestionBlock title="Comment puis-je utiliser ces données dans mon site internet ?">
          <p>
            Toutes les données présentées sur le site sont publiées en
            open-data. Pour en savoir plus sur la démarche, vous pouvez
            consulter la <a href="/comment-ca-marche">page "à propos"</a>.
          </p>
          <p>
            Vous pouvez également consulter les fiches explicatives de chaque
            administration :
            <ul>
              <li>
                <a href="/administration/inpi#acces">L’INPI</a>
              </li>
              <li>
                <a href="/administration/insee#acces">L’INSEE</a>
              </li>
              <li>
                <a href="/administration/cma-france#acces">CMA-France</a>
              </li>
              <li>
                <a href="/administration/meti#acces">Le Ministère du Travail</a>
              </li>
              <li>
                <a href="/administration/dila#acces">La DILA</a>
              </li>
            </ul>
          </p>
        </QuestionBlock>
        <QuestionBlock title="Je ne trouve pas la réponse à ma question">
          <p>Vous pouvez nous poser une question directement :</p>
          <div className="layout-center">
            <ButtonLink href={constants.links.mailto} alt>
              Nous écrire
            </ButtonLink>
          </div>
        </QuestionBlock>
      </div>
    </div>

    <style jsx>{`
      .questions {
        margin: 20px 0 60px;
      }
    `}</style>
  </Page>
);

export default FAQ;
