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
      <div className="content-container container">
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
        max-height:0;
        overflow:hidden;
        transition: max-height 150ms ease-in-out,padding 150ms ease-in-out;
        background-color: #f3f3f3;
        border-radius:2px;
        padding:15px;
        display:block;
      }

      label {
        display:block;
        font-weight:bold;
        font-size:1.4rem;
        line-height:1.8rem;
        padding: 20px 0;
        cursor:pointer;
        position:relative;
        margin-right:25px;
      }
      label:after {
        content:"▾";
        position:absolute;
        color:#000091;
        right:-25px;
        top:20px;
        transition:transform 200ms ease-in-out;
      }


      .toggle__input {
          display: none;
      }
      .toggle__input:checked ~ div {
        max-height:500px;
        display block;
        padding:15px;
      }
      .toggle__input:checked ~ label:after {
        transform:rotate(-180deg);
      }
      .toggle__input:not(:checked) ~ div {
        max-height:0;
        padding:0 15px;
      }
      .toggle__input:not(:checked) ~ label:after {
        transform:rotate(0deg);
      }

      @media only screen and (min-width: 1px) and (max-width: 600px) {
        label {
          padding: 20px 0;
          font-size:1.2rem;
          line-height:1.4rem;
        }
      }
    `}</style>
    </>
  );
};

const FAQ: React.FC<{}> = () => (
  <Page small={true} title="FAQ de l’Annuaire des Entreprises">
    <div className="content-container">
      <div className="layout-center">
        <h1>FAQ de l’Annuaire des Entreprises</h1>
      </div>
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
        <QuestionBlock title="Qu'est-ce qu'une entreprise non-diffusible ?">
          <NonDiffusible />
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
          <p>Consultez la page “À propos”</p>
          <div className="layout-center">
            <ButtonLink href="/comment-ca-marche" alt>
              À propos
            </ButtonLink>
          </div>
        </QuestionBlock>
        <QuestionBlock title="Je ne trouve pas la réponse a ma question">
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
