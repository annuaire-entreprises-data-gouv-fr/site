import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import ButtonLink from '#components-ui/button';
import { MultiChoice } from '#components-ui/multi-choice';
import { LayoutDefault } from '#components/layouts/layout-default';
import constants from '#models/constants';
import { randomId } from '#utils/helpers';
import { postServerSideProps } from '#utils/server-side-props-helper/post-server-side-props';
import { isAgent, isSuperAgent } from '#utils/session';
import useSession from 'hooks/use-session';
import { NextPageWithLayout } from 'pages/_app';

export const visitorTypes = [
  {
    value: 'Indépendant',
    label: 'Indépendant(e)',
  },
  {
    value: 'Dirigeant',
    label: 'Dirigeant(e) d’entreprise ou d’association',
  },
  {
    value: 'Agent public non connecté',
    label: 'Agent public',
  },
  {
    value: 'Salarié',
    label: 'Salarié(e) d’entreprise ou d’association',
  },
  {
    value: 'Particulier',
    label: 'Particulier',
  },
  {
    value: 'Autre',
    label: 'Autre',
  },
];

const FeedBackPage: NextPageWithLayout = () => {
  const uuid = randomId();
  const session = useSession();
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
          Attention, <strong>ce formulaire est anonyme</strong>. Si vous avez
          une demande précise,{' '}
          <a href={constants.links.parcours.contact}>contactez-nous</a>.
        </div>
        <div className="content-container form-container">
          <form action="/api/feedback/nps" method="post" id="form-feedback-nps">
            <input name="uuid" value={uuid} type="hidden" />
            <fieldset>
              <MultiChoice
                legend="Sur une échelle de 1 à 10, à quel point recommanderiez-vous l’Annuaire des Entreprises ?"
                values={[
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: '4', label: '4' },
                  { value: '5', label: '5' },
                  { value: '6', label: '6' },
                  { value: '7', label: '7' },
                  { value: '8', label: '8' },
                  { value: '9', label: '9' },
                  { value: '10', label: '10' },
                ]}
                name="radio-set-mood"
                idPrefix="radio-smiley"
                required={true}
                centered
                large
              />
            </fieldset>

            <fieldset>
              {isAgent(session) ? (
                <input
                  aria-hidden
                  type="hidden"
                  name="radio-set-visitor-type"
                  value={
                    isSuperAgent(session)
                      ? 'Super-agent connecté'
                      : 'Agent connecté'
                  }
                  tabIndex={-1}
                />
              ) : (
                <MultiChoice
                  legend="Vous êtes venu(e) sur l’Annuaire des Entreprises en tant que :"
                  values={visitorTypes}
                  name="radio-set-visitor-type"
                  idPrefix="radio-visitor-type"
                  required={false}
                />
              )}
            </fieldset>
            <fieldset>
              <MultiChoice
                legend="Comment êtes-vous arrivé(e) jusqu’ici ?"
                values={[
                  {
                    value: 'Bouche à oreille',
                    label: 'Bouche à oreille',
                  },
                  {
                    value: 'Moteur de recherche',
                    label: 'Moteur de recherche',
                  },
                  {
                    value: 'Je connaissais déjà le site',
                    label: 'Je connaissais déjà le site',
                  },
                  {
                    value:
                      'J’ai cliqué sur un lien depuis un autre site internet',
                    label:
                      'J’ai cliqué sur un lien depuis un autre site internet',
                  },
                  {
                    value: 'Autre',
                    label: 'Autre',
                  },
                ]}
                name="radio-set-visitor-origin"
                idPrefix="radio-visitor-origin"
                required={false}
              />
            </fieldset>
            <fieldset>
              <legend>
                <h2>Avez-vous quelque chose d’autre à nous dire ?</h2>
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
              <div className="fr-input-group">
                <label className="fr-label" htmlFor="textarea">
                  Facultatif : laissez-nous votre email si vous acceptez d’être
                  recontacté.
                </label>
                <input
                  className="fr-input"
                  id="email"
                  name="email"
                  type="email"
                />
              </div>
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
        <style jsx global>
          {`
            #form-feedback-nps {
              counter-reset: question;
            }
            #form-feedback-nps > fieldset > legend h2::before {
              counter-increment: question;
              content: counter(question) ' ・ ';
              font-weight: bold;
            }
          `}
        </style>
      </main>
    </div>
  );
};

FeedBackPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutDefault searchBar={false}>{page}</LayoutDefault>;
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  () => ({})
);

export default FeedBackPage;
