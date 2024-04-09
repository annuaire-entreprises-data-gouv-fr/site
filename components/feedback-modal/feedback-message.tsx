import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Error } from '#components-ui/alerts';
import FadeIn from '#components-ui/animation/fade-in';
import ButtonLink from '#components-ui/button';
import { Loader } from '#components-ui/loader';
import Textarea from '#components-ui/textarea';
import constants from '#models/constants';
import { FeedbackType } from './type';

type IProps = { type: FeedbackType; isErrored: boolean };
export default function FeedbackMessage({ type, isErrored }: IProps) {
  const [feedbackContent, setFeedbackContent] = useState('' as string);
  const { pending } = useFormStatus();

  if (!type) return null;
  if (type === 'question') {
    return (
      <>
        <p>
          🔎 La réponse à votre question se trouvera peut-être dans notre FAQ
        </p>
        <div className="fr-btns-group">
          <a className="fr-btn" href="/faq/parcours">
            Consulter la FAQ
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <fieldset className="fr-input-group">
        <label className="fr-label" htmlFor="feedback-textarea">
          {
            {
              bug: '🐞 J’ai constaté un bug ou un problème',
              idée: '💡 J’ai une idée ou une suggestion',
              'donnée manquante': '🔍 Une donnée me manque',
            }[type]
          }
        </label>
        <Textarea
          autoResize
          id="feedback-textarea"
          name="message"
          required
          value={feedbackContent}
          onChange={(e) => setFeedbackContent(e.target.value)}
          placeholder="Dites-nous tout"
        />
      </fieldset>
      {isErrored && !pending && (
        <FadeIn>
          <Error full>
            <p>
              <strong>
                Une erreur est survenue lors de l’envoi de votre message.
              </strong>
            </p>
            <p>
              Vous pouvez réessayer ou contacter l’équipe de l’Annuaire des
              Entreprises directement à l’adresse :{' '}
              <a href={constants.links.mailto}>{constants.links.mail}</a>
            </p>
          </Error>
        </FadeIn>
      )}
      <div className="fr-btns-group">
        <ButtonLink
          role="submit"
          disabled={pending}
          aria-label="Envoyer votre message"
        >
          Envoyer {pending && <Loader />}
        </ButtonLink>
      </div>
    </>
  );
}
