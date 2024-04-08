'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { HeightTransition } from '#components-ui/animation/height-transition';
import FloatingHelpButton from '#components-ui/floating-help-button';
import FloatingModal from '#components-ui/floating-modal';
import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import FeedbackForm from './feedback-form';
import RegisterBeta from './register-beta';
import styles from './style.module.css';
import { IAgentContactInfo } from './type';

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
        {!opened && (
          <FloatingHelpButton>
            <button
              ref={buttonRef}
              aria-label="Partager une idée, un bug, une question ou une donnée manquante avec l'équipe de l'Annuaire des Entreprises"
              onClick={() => (opened ? handleClose() : handleOpen())}
              aria-controls="feedback-modal"
              aria-haspopup="dialog"
              aria-expanded={opened}
              className={styles.button}
            >
              <Icon slug="discussion" size={24} />
            </button>
          </FloatingHelpButton>
        )}
        <FloatingModal
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
        </FloatingModal>
      </div>
    </PrintNever>
  );
}
