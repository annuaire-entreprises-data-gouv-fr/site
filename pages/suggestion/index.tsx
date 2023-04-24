import { ReactElement } from 'react';
import ButtonLink from '#components-ui/button';
import { MultiChoice } from '#components-ui/multi-choice';
import { LayoutDefault } from '#components/layouts/layout-default';
import { randomId } from '#utils/helpers';
import { NextPageWithLayout } from 'pages/_app';

const FeedBackPage: NextPageWithLayout = () => {
  const uuid = randomId();
  return (
    <div id="page-layout">
      <main className="fr-container">
        <div className="layout-center">
          <h1>Vous avez des suggestions pour l’Annuaire des Entreprises ?</h1>
        </div>
        <br />
        <div className="layout-center">
          <i>(temps estimé : 1 min)</i>
        </div>
        <br />
        <br />
        <div className="content-container form-container">
          <form action="/api/feedback/suggestion" method="post">
            <input name="uuid" value={uuid} type="hidden" />
            <fieldset>
              <MultiChoice
                legend="1 ・ Vous êtes venu(e) sur l’Annuaire des Entreprises en tant que :"
                values={[
                  {
                    value: 'Agent public',
                    label: 'Agent public',
                  },
                  {
                    value: 'Dirigeant',
                    label: 'Dirigeant(e) d’entreprise ou d’association',
                  },
                  { value: 'Indépendant', label: 'Indépendant(e)' },
                  {
                    value: 'Salarié',
                    label: 'Salarié(e) d’entreprise ou d’association',
                  },
                  { value: 'Particulier', label: 'Particulier' },
                  { value: 'Autre', label: 'Autre' },
                ]}
                name="radio-set-visitor-type"
                idPrefix="radio-visitor-type"
                required={false}
              />
            </fieldset>
            <fieldset>
              <legend>
                <h2>2 ・ Quelle est votre e-mail ? (optionel)</h2>
              </legend>
              <label className="fr-label" htmlFor="textarea">
                Nous vous contacterons si nous avons besoin de plus
                d’informations.
              </label>
              <input className="fr-input" id="textarea" name="email" />
            </fieldset>
            <fieldset>
              <legend>
                <h2>3 ・ Que voulez-vous nous dire ?</h2>
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
    <LayoutDefault isBrowserOutdated={isBrowserOutdated} searchBar={false}>
      {page}
    </LayoutDefault>
  );
};

export default FeedBackPage;
