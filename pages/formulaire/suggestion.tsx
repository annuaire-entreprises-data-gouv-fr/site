import { ReactElement } from 'react';
import ButtonLink from '#components-ui/button';
import { MultiChoice } from '#components-ui/multi-choice';
import { LayoutDefault } from '#components/layouts/layout-default';
import { randomId } from '#utils/helpers';
import { NextPageWithLayout } from 'pages/_app';
import { visitorTypes } from './nps';

const SuggestionPage: NextPageWithLayout = () => {
  const uuid = randomId();
  return (
    <div id="page-layout">
      <main className="fr-container">
        <div className="layout-center">
          <h1>Vos idées nous intéressent !</h1>
        </div>
        <br />
        <div className="layout-center">
          Un retour ? Une idée d’amélioration ? Dites-le-nous, cela nous aide à
          améliorer le site.
        </div>
        <div className="content-container form-container">
          <form action="/api/feedback/suggestion" method="post">
            <input name="uuid" value={uuid} type="hidden" />
            <fieldset>
              <MultiChoice
                legend="1 ・ Vous êtes venu(e) sur l’Annuaire des Entreprises en tant que :"
                values={visitorTypes}
                name="radio-set-visitor-type"
                idPrefix="radio-visitor-type"
                required={false}
              />
            </fieldset>
            <fieldset>
              <legend>
                <h2>2 ・ Que pouvons-nous améliorer (requis) ?</h2>
              </legend>
              <div className="fr-input-group">
                <label className="fr-label" htmlFor="feedback">
                  Vous rêvez d’une fonctionnalité ? Vous détestez le bleu ?
                  Dites-nous tout !
                </label>
                <textarea
                  className="fr-input"
                  id="feedback"
                  name="textarea"
                  required
                  rows={5}
                ></textarea>
              </div>
            </fieldset>
            <fieldset>
              <legend>
                <h2>3 ・ Quel est votre e-mail ?</h2>
              </legend>
              <label className="fr-label" htmlFor="email">
                Vous pouvez nous laisser votre adresse email si vous acceptez
                d’être recontacté.
              </label>
              <input
                className="fr-input"
                id="email"
                name="email"
                required
                type="email"
              />
            </fieldset>
            <br />
            <div className="layout-center">
              <ButtonLink small={false} type="submit">
                Envoyer
              </ButtonLink>
            </div>
          </form>
        </div>
        <style jsx>
          {`
            fieldset {
              border: none;
              margin: 40px 0;
              padding: 0;
            }
          `}
        </style>
      </main>
    </div>
  );
};

SuggestionPage.getLayout = function getLayout(
  page: ReactElement,
  isBrowserOutdated
) {
  return (
    <LayoutDefault isBrowserOutdated={isBrowserOutdated} searchBar={false}>
      {page}
    </LayoutDefault>
  );
};

export default SuggestionPage;
