import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import constants from '../models/constants';
import ButtonLink from '../components-ui/button';
import { DILA, INPI, INSEE, METI, CMA } from '../components/administrations';

import Page from '../layouts';
import NonDiffusible from '../components/non-diffusible';
import QuestionBlock from '../components/faq/question-block';
import StructuredDataFAQ from '../components/structured-data/faq';

const questions = [
  {
    title:
      "Je cherche une entreprise qui n'apparait pas dans les résultats de recherche",
    answer: (
      <>
        <p>
          Il existe plusieurs raisons pour lesquelles une entreprise peut ne pas
          apparaitre dans les résultats de recherche :
        </p>
        <ul>
          <li>
            Vous avez pu faire une faute de frappe en tapant le nom de
            l’entreprise.
          </li>
          <li>
            Si l’entreprise est récente, les données peuvent ne pas encore être
            à jour (les données du moteur de recherche sont mises à jour tous
            les mois)
          </li>
          <li>
            C’est une entreprise non-diffusible (voir l’explication ci-dessous)
          </li>
        </ul>
      </>
    ),
  },
  {
    title:
      'Pourquoi mon adresse personnelle apparait-elle sur l’Annuaire des Entreprises ?',
    answer: (
      <>
        <p>
          Les pages des entreprises individuelles et des auto-entreprises, sont
          susceptibles de contenir des informations à caractère personnel. Dans
          le cadre de l’article{' '}
          <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031043097/">
            A123-96 du code de Commerce
          </a>
          , chaque personne physique inscrite au répertoire Sirene comme
          entrepreneur individuel peut choisir de rendre publiques ou non les
          données qui la concernent.
        </p>
        <p>
          La procédure s’appelle “changement de statut de diffusion” et elle est
          à effectuer auprès de L’
          <INSEE /> :
        </p>
        <div className="layout-center">
          <ButtonLink to="https://statut-diffusion-sirene.insee.fr/" alt>
            ⇢ Changer le statut de diffusion de mon entreprise
          </ButtonLink>
        </div>
      </>
    ),
  },
  {
    title: 'Qu’est-ce qu’une entreprise non-diffusible ?',
    answer: <NonDiffusible />,
  },
  {
    title:
      'L’adresse de mon entreprise ou de mon association est incorrecte, comment la modifier ?',
    answer: (
      <>
        <p>
          Comme expliqué par l’
          <INSEE /> dans sa{' '}
          <a href="https://www.insee.fr/fr/information/2015441#titre-bloc-1">
            documentation aux entreprises
          </a>
          , tout changement d’adresse est à déclarer auprès de son centre de
          formalités des entreprises (CFE)
        </p>
        <div className="layout-center">
          <ButtonLink to="https://www.insee.fr/fr/information/1972060" alt>
            ⇢ Trouver son CFE
          </ButtonLink>
        </div>
      </>
    ),
  },
  {
    title:
      'Je suis un agent public et je cherche les données présentes dans un extrait KBIS/D1',
    answer: (
      <>
        <p>
          À partir de Novembre 2021, les entreprises immatriculées au RCS ou au
          RNM n’ont plus à fournir leur extrait KBIS dans leurs démarches
          administratives, le seul numéro siret suffit à l’administration pour
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
      </>
    ),
  },
  {
    title: 'La fiche d’immatriculation de mon entreprise est introuvable',
    answer: (
      <>
        <p>
          Les entreprises individuelles et les auto-entreprises, ne sont{' '}
          <b>pas obligées d’être immatriculées</b>. Il est donc possible que
          vous ne trouviez pas de fiche d’immatriculation pour une entreprise de
          ce type.
        </p>
        <p>
          En revanche, les entreprises de toutes les autres formes juridiques{' '}
          <b>doivent être immatriculées</b>. Si vous ne trouvez pas de fiche
          d’immatriculation pour une entreprise, deux choix s’offrent à vous :
        </p>
        <ul>
          <li>
            Si l’entreprise est une entreprise artisanale,{' '}
            <a href="https://rnm.artisanat.fr/">
              contactez les Chambres des Métiers de l‘Artisanat
            </a>
          </li>
          <li>
            Si l’entreprise n‘est pas une entreprise artisanale,{' '}
            <a href="http://data.inpi.fr/">
              contactez l‘INPI qui centralise les données des Greffes des
              tribunaux de commerce.
            </a>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Quelle est la fréquence de mise à jour des données ?',
    exludeFromStructuredData: true,
    answer: (
      <>
        <p>
          Les données du moteur de recherche sont mises à jour tous les mois.
        </p>
        <p>
          Les données affichées sur chaque page entreprise sont mis à jour en
          temps-réel. Les données proviennent des{' '}
          <a href="/administration">services informatiques</a> des différentes
          administrations concernées.
        </p>
      </>
    ),
  },
  {
    title: 'Comment puis-je utiliser ces données dans mon site internet ?',
    answer: (
      <>
        <p>
          Toutes les données présentées sur le site sont publiées en open-data.
          Pour en savoir plus sur la démarche, vous pouvez consulter la{' '}
          <a href="/comment-ca-marche">page “à propos”</a>.
        </p>
        <p>
          Vous pouvez également consulter les fiches explicatives de chaque
          administration :
          <ul>
            <li>
              L’
              <INPI queryString="#acces" />
            </li>
            <li>
              L’
              <INSEE queryString="#acces" />
            </li>
            <li>
              <CMA queryString="#acces" />
            </li>
            <li>
              Le <METI queryString="#acces" />
            </li>
            <li>
              La <DILA queryString="#acces" />
            </li>
          </ul>
        </p>
      </>
    ),
  },
  {
    title: 'Existe-t-il une API Annuaire des Entreprises ?',
    answer: (
      <p>
        Il n’existe pas d’API centralisée, mais un ensemble d’API ouvertes,
        officielles et gratuites.
        <br />
        Vous pouvez retrouver la liste détaillée{' '}
        <a href="/administration">sur cette page.</a>
      </p>
    ),
  },
  {
    title: 'Je ne trouve pas la réponse à ma question',
    answer: (
      <>
        <p>Vous pouvez nous poser une question directement :</p>
        <div className="layout-center">
          <ButtonLink to={constants.links.mailto} alt>
            Écrivez-nous à {constants.links.mail}
          </ButtonLink>
        </div>
      </>
    ),
    excludeFromStructuredData: true,
  },
];

const FAQ: React.FC<{}> = () => (
  <Page small={true} title="FAQ de l’Annuaire des Entreprises">
    <StructuredDataFAQ
      data={questions
        .filter((q) => !q.excludeFromStructuredData)
        .map((q) => [q.title, renderToStaticMarkup(q.answer)])}
    />
    <div className="content-container text-wrapper">
      <h1>FAQ</h1>
      <p>Conseils et réponses de l’équipe Annuaire des Entreprises</p>
      <div className="questions">
        {questions.map((question) => (
          <QuestionBlock key={question.title} title={question.title}>
            {question.answer}
          </QuestionBlock>
        ))}
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
