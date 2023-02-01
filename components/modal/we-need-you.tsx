import React from 'react';
import ButtonLink from '#components-ui/button';

export const WeNeedYouModal: React.FC<{}> = () => (
  <>
    <div
      id="we-need-you-modal"
      role="dialog"
      aria-label="Donnez-nous votre avis"
    >
      <div
        className="background-close-modal"
        dangerouslySetInnerHTML={{
          __html: `
                <div onclick="window.closeModal('we-need-you-modal')" style="width:100%; height:100%; z-index:99"></div>
          `,
        }}
      />
      <div className="modal">
        <b>Nous sommes curieux ! 👀</b>
        <p>
          Dites-nous comment vous utilisez le site, comment nous pourrions
          l’améliorer et le compléter.
        </p>
        <br />
        <div className="layout-center">
          <ButtonLink
            to="https://startupdetat.typeform.com/to/gyOD5443"
            target="_blank"
          >
            Aidez-nous en répondant au questionnaire
          </ButtonLink>
        </div>
        <br />
        <div
          className="close-modal"
          dangerouslySetInnerHTML={{
            __html: `
            <button onclick="window.closeModal('we-need-you-modal')" style="box-shadow:none;font-family: 'Marianne', sans-serif;padding: 0;outline: none;border: none;background-color: transparent;">
            <b>Ne plus afficher ce message ✕</b>
            </button>
            `,
          }}
        />
      </div>
    </div>
  </>
);
