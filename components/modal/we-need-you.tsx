import React from 'react';
import ButtonLink from '../button';

export const WeNeedYouModal: React.FC<{}> = () => (
  <>
    <div
      id="we-need-you-modal"
      role="dialog"
      aria-label="Donnez-nous votre avis"
    >
      <div className="modal">
        <h2>Nous sommes curieux ! 👀</h2>
        <p>
          Dites-nous comment vous utilisez le site, comment nous pourrions
          l'améliorer et le compléter.
        </p>
        <br />
        <div className="layout-center">
          <ButtonLink
            href="https://startupdetat.typeform.com/to/gyOD5443"
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
              <button onclick="window.closeWeNeedYouModal()" style="box-shadow:none;font-family: 'Marianne', sans-serif;padding: 0;outline: none;border: none;background-color: transparent;">
                <b>Ne plus afficher ce message ✕</b>
              </button>
        `,
          }}
        />
      </div>
    </div>
    <style jsx>{`
      #we-need-you-modal {
        z-index: 100;
        position: fixed;
        width: 100%;
        height: 100vh;
        top: 0;
        font-size: 0.9rem;
        background-color: rgba(0, 0, 0, 0.3);
        font-family: 'Marianne', sans-serif;
        display: none;
        align-items: center;
        justify-content: center;
      }
      .modal {
        background-color: #fff;
        max-width: 550px;
        min-height: 200px;
        position: relative;
        padding: 40px;
        text-align: center;
        border-radius: 3px;
      }
      .modal:before {
        position: absolute;
        border-top: 3px solid #000091;
        border-left: 3px solid #000091;
        content: '';
        height: 30px;
        width: 30px;
        left: 10px;
        top: 10px;
      }
      .modal:after {
        position: absolute;
        border-bottom: 3px solid #000091;
        border-right: 3px solid #000091;
        content: '';
        height: 30px;
        width: 30px;
        right: 10px;
        bottom: 10px;
      }

      .close-modal {
        position: absolute;
        top: 20px;
        right: 20px;
      }
    `}</style>
  </>
);
