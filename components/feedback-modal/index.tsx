'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { HeightTransition } from '#components-ui/animation/height-transition';
import { PrintNever } from '#components-ui/print-visibility';
import { IAgentContactInfo } from '#utils/session';
import FeedbackForm from './feedback-form';
import RegisterBeta from './register-beta';
import styles from './style.module.css';

type IProps = {
  agentContactInfo: IAgentContactInfo;
};
export default function FeedbackModal({ agentContactInfo }: IProps) {
  const [opened, setOpened] = useState(false as boolean);
  const [formSubmitted, setFormSubmitted] = useState(false as boolean);
  const handleClose = () => {
    setOpened(false);
    setFormSubmitted(false);
    buttonRef.current?.focus();
  };
  const handleOpen = () => {
    setOpened(true);
  };

  useLayoutEffect(() => {
    if (!opened) {
      return;
    }
    // We focus the first input or button that is not a close button,
    // because autoFocus does not work in a dialog
    //
    // See https://github.com/facebook/react/issues/23301
    (
      dialogRef.current?.querySelector('input') ??
      dialogRef.current?.querySelector('button:not([aria-controls])')
    )?.focus();
  }, [opened, formSubmitted]);

  const handleFormSubmit = () => {
    setFormSubmitted(true);
    dialogRef.current?.focus();
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  return (
    <PrintNever>
      <div onKeyDown={handleKeyDown}>
        <button
          ref={buttonRef}
          aria-label="Partager une idée, un bug, une question ou une donnée manquante avec l'équipe de l'Annuaire des Entreprises"
          onClick={() => (opened ? handleClose() : handleOpen())}
          aria-controls="feedback-modal"
          aria-haspopup="dialog"
          className={styles.button}
          aria-expanded={opened}
        >
          {!opened ? (
            <Icon />
          ) : (
            <span
              aria-label="Fermer la fenêtre de retour"
              className={styles.close}
            >
              ×
            </span>
          )}
        </button>

        <div
          id="feedback-modal"
          aria-modal="false"
          aria-hidden={!opened}
          role="dialog"
          ref={dialogRef}
          className={styles.dialog}
          aria-label="Partager une idée, un bug, une question ou une donnée manquante avec l'équipe de l'Annuaire des Entreprises"
        >
          <button
            onClick={handleClose}
            className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm"
            aria-label="Fermer la fenêtre de retour"
            aria-controls="feedback-modal"
          >
            × Fermer
          </button>
          <HeightTransition>
            {formSubmitted ? (
              <RegisterBeta agentContactInfo={agentContactInfo} />
            ) : (
              <FeedbackForm
                onSubmit={handleFormSubmit}
                agentContactInfo={agentContactInfo}
              />
            )}
          </HeightTransition>
        </div>
      </div>
    </PrintNever>
  );
}

function Icon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M28.5 0.5C29.3284 0.5 30 1.17157 30 2V23C30 23.8284 29.3284 24.5 28.5 24.5H6.6825L0 29.75V2C0 1.17157 0.671573 0.5 1.5 0.5H28.5ZM16.5 15.5H13.5V18.5H16.5V15.5ZM16.5 6.5H13.5V14H16.5V6.5Z"
        fill="white"
      />
    </svg>
  );
}
