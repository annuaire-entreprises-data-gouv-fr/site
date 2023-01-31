import React, { ReactElement } from 'react';
import ButtonLink from '#components-ui/button';
import { Layout } from '#components/layouts/layoutDefault';
import constants from '#models/constants';
import { randomId } from '#utils/helpers';
import { NextPageWithLayout } from 'pages/_app';

const FeedBackPage: NextPageWithLayout = () => {
  const uuid = randomId();
  return (
    <div id="page-layout">
      <main className="fr-container">
        <div className="layout-center">
          <h1>Quel est votre avis sur l’Annuaire des Entreprises ?</h1>
        </div>
        <br />
        <div className="layout-center">
          Donnez-nous votre avis en 4 réponses rapides !
        </div>
        <div className="layout-center">
          <i>(temps estimé : 1 min)</i>
        </div>
        <br />
        <br />
        <div>
          Attention, <b>ce formulaire est anonyme</b>. Si vous avez une demande
          précise, écrivez-nous un mail à{' '}
          <a href={constants.links.mailto}>{constants.links.mail}</a> et nous
          vous répondrons.
        </div>
        <div className="content-container form-container">
          <form action="/api/feedback/nps" method="post">
            <input name="uuid" value={uuid} type="hidden" />
            <fieldset>
              <legend>
                <h2>
                  1 ・ Sur une échelle de 1 à 10, à quel point
                  recommanderiez-vous l’Annuaire des Entreprises ?
                </h2>
              </legend>
              <div className="radio-group rating">
                <div>
                  <input
                    type="radio"
                    id="radio-smiley-1"
                    name="radio-set-mood"
                    value="1"
                    required
                  />
                  <label className="fr-label" htmlFor="radio-smiley-1">
                    1
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-smiley-2"
                    name="radio-set-mood"
                    value="2"
                  />
                  <label className="fr-label" htmlFor="radio-smiley-2">
                    2
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-smiley-3"
                    name="radio-set-mood"
                    value="3"
                  />
                  <label className="fr-label" htmlFor="radio-smiley-3">
                    3
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-smiley-4"
                    name="radio-set-mood"
                    value="4"
                  />
                  <label className="fr-label" htmlFor="radio-smiley-4">
                    4
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-smiley-5"
                    name="radio-set-mood"
                    value="5"
                  />
                  <label className="fr-label" htmlFor="radio-smiley-5">
                    5
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-smiley-6"
                    name="radio-set-mood"
                    value="6"
                  />
                  <label className="fr-label" htmlFor="radio-smiley-6">
                    6
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-smiley-7"
                    name="radio-set-mood"
                    value="7"
                  />
                  <label className="fr-label" htmlFor="radio-smiley-7">
                    7
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-smiley-8"
                    name="radio-set-mood"
                    value="8"
                  />
                  <label className="fr-label" htmlFor="radio-smiley-8">
                    8
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-smiley-9"
                    name="radio-set-mood"
                    value="9"
                  />
                  <label className="fr-label" htmlFor="radio-smiley-9">
                    9
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-smiley-10"
                    name="radio-set-mood"
                    value="10"
                  />
                  <label className="fr-label" htmlFor="radio-smiley-10">
                    10
                  </label>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <h2>
                  2 ・ Vous êtes venu(e) sur l’Annuaire des Entreprises en tant
                  que :
                </h2>
              </legend>
              <div className="radio-group">
                <div>
                  <input
                    type="radio"
                    id="radio-visitor-type-1"
                    name="radio-set-visitor-type"
                    value="Agent public"
                  />
                  <label className="fr-label" htmlFor="radio-visitor-type-1">
                    Agent public
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-visitor-type-2"
                    name="radio-set-visitor-type"
                    value="Dirigeant"
                  />
                  <label className="fr-label" htmlFor="radio-visitor-type-2">
                    Dirigeant(e) d’entreprise ou d’association
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-visitor-type-6"
                    name="radio-set-visitor-type"
                    value="Indépendant"
                  />
                  <label className="fr-label" htmlFor="radio-visitor-type-2">
                    Indépendant(e)
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-visitor-type-5"
                    name="radio-set-visitor-type"
                    value="Salarié"
                  />
                  <label className="fr-label" htmlFor="radio-visitor-type-5">
                    Salarié(e) d’entreprise ou d’association
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-visitor-type-3"
                    name="radio-set-visitor-type"
                    value="Particulier"
                  />
                  <label className="fr-label" htmlFor="radio-visitor-type-3">
                    Particulier
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-visitor-type-4"
                    name="radio-set-visitor-type"
                    value="Autre"
                  />
                  <label className="fr-label" htmlFor="radio-visitor-type-4">
                    Autre
                  </label>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <h2>3 ・ Comment êtes-vous arrivé jusqu’ici ?</h2>
              </legend>
              <div className="radio-group">
                <div>
                  <input
                    type="radio"
                    id="radio-visitor-origin-1"
                    name="radio-set-visitor-origin"
                    value="Bouche à oreille"
                  />
                  <label className="fr-label" htmlFor="radio-visitor-origin-1">
                    Bouche à oreille
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-visitor-origin-2"
                    name="radio-set-visitor-origin"
                    value="Moteur de recherche"
                  />
                  <label className="fr-label" htmlFor="radio-visitor-origin-2">
                    Moteur de recherche
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-visitor-origin-6"
                    name="radio-set-visitor-origin"
                    value="Je connaissais déjà le site"
                  />
                  <label className="fr-label" htmlFor="radio-visitor-origin-6">
                    Je connaissais déjà le site
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-visitor-origin-3"
                    name="radio-set-visitor-origin"
                    value="J’ai cliqué sur un lien depuis un autre site internet"
                  />
                  <label className="fr-label" htmlFor="radio-visitor-origin-3">
                    J’ai cliqué sur un lien depuis un autre site internet
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="radio-visitor-origin-4"
                    name="radio-set-visitor-origin"
                    value="autre"
                  />
                  <label className="fr-label" htmlFor="radio-visitor-origin-4">
                    Autre
                  </label>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <h2>4 ・ Avez-vous quelque chose d’autre à nous dire ?</h2>
              </legend>

              <div className="fr-input-group">
                <label className="fr-label" htmlFor="textarea">
                  Vous rêvez d’une fonctionnalité ? Vous détestez le bleu ?
                  Dites-nous tout !
                </label>
                <textarea
                  className="fr-input"
                  id="textarea"
                  name="textarea"
                ></textarea>
              </div>
            </fieldset>
            <br />
            <div className="layout-center">
              <ButtonLink small={false} type="submit">
                Soumettre le formulaire
              </ButtonLink>
            </div>
          </form>
        </div>

        <style jsx>
          {`
            .form-container {
              margin-top: 0;
            }
            fieldset {
              border: none;
              margin: 40px 0;
              padding: 0;
            }
            .radio-group {
              display: flex;
              flex-wrap: wrap;
            }
            .radio-group.rating {
              justify-content: center;
            }
            .radio-group.rating > div > label {
              font-weight: bold;
              color: #000091;
              background: #e5e5f4;
              font-size: 2rem;
              line-height: 3rem;
              margin: 15px 10px;
            }
            .radio-group > div > label {
              border: 2px solid transparent;
              border-radius: 6px;
              background: #e5e5f4;
              padding: 4px 10px;
              margin: 5px;
            }
            .radio-group > div > input {
              opacity: 0;
              height: 0;
              width: 0;
              position: absolute;
            }

            input[type='radio']:hover + label {
              border: 2px dashed #000091;
            }
            input[type='radio']:checked + label {
              border: 2px solid #000091;
            }

            h2 {
              font-size: 1.3rem;
            }

            @media only screen and (min-width: 1px) and (max-width: 600px) {
              .radio-group.smileys {
                flex-direction: column;
                align-items: center;
              }
            }
          `}
        </style>
      </main>
    </div>
  );
};

FeedBackPage.getLayout = function getLayout(
  page: ReactElement,
  isBrowserOutdated
) {
  return (
    <Layout isBrowserOutdated={isBrowserOutdated} searchBar={false}>
      {page}
    </Layout>
  );
};

export default FeedBackPage;
