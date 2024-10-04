'use client';
import { HeightTransition } from '#components-ui/animation/height-transition';
import '#components-ui/floating-modal/style.module.css';
import { useRef, useState } from 'react';
import { sendFeedback } from './actions';
import FeedbackMessage from './feedback-message';
import styles from './style.module.css';
import { FeedbackType, IAgentContactInfo } from './type';

type IProps = { onSubmit: () => void; agentContactInfo: IAgentContactInfo };
export default function FeedbackForm({ onSubmit, agentContactInfo }: IProps) {
  const [type, setType] = useState<FeedbackType | ''>('');

  const [isErrored, setIsErrored] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleChangeFeedbackType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value as FeedbackType);
  };

  const handleSubmit = async (data: FormData) => {
    const state = await sendFeedback(agentContactInfo, data);
    setIsErrored(!state);
    if (!state) {
      return;
    }
    onSubmit();
    formRef.current?.reset();
  };

  return (
    <HeightTransition>
      <form action={handleSubmit} ref={formRef}>
        <p className="fr-text--lg">
          <strong>👋 Bonjour</strong>
        </p>
        <fieldset className={styles.type}>
          <legend>
            Qu’aimeriez-vous partager avec l’équipe de l‘Annuaire des
            Entreprises&nbsp;?
          </legend>
          <input
            autoFocus
            className="fr-sr-only"
            type="radio"
            onChange={handleChangeFeedbackType}
            id="feedback-bug"
            name="type"
            value="bug"
          />
          <label htmlFor="feedback-bug">Un bug ou un problème ?</label>
          <input
            className="fr-sr-only"
            type="radio"
            onChange={handleChangeFeedbackType}
            id="feedback-idee"
            name="type"
            value="idée"
          />
          <label htmlFor="feedback-idee">Une idée ou suggestion ?</label>
          <input
            className="fr-sr-only"
            type="radio"
            id="feedback-data"
            onChange={handleChangeFeedbackType}
            name="type"
            value="donnée manquante"
          />
          <label htmlFor="feedback-data">Une donnée qui vous manque ?</label>
          <input
            className="fr-sr-only"
            type="radio"
            onChange={handleChangeFeedbackType}
            id="feedback-question"
            name="type"
            value="question"
          />
          <label htmlFor="feedback-question">Une question ?</label>
        </fieldset>
        <p>
          Retrouvez-nous et posez-nous vos questions sur{' '}
          <a
            href="https://tchap.gouv.fr/#/room/#annuaire-entreprises:agent.dinum.tchap.gouv.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tchap
          </a>{' '}
          et sur{' '}
          <a
            href="https://www.linkedin.com/company/annuaire-des-entreprises"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          .
        </p>
        {type && <FeedbackMessage type={type} isErrored={isErrored} />}
      </form>
    </HeightTransition>
  );
}
