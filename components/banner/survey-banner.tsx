import React from 'react';
import ButtonLink from '#components-ui/button';
import constants from '#models/constants';

export const SurveyBanner: React.FC<{}> = () => (
  <>
    <div id="survey-banner" role="dialog" aria-label="Donnez-nous votre avis">
      <div className="fr-container">
        <div className="modal ">
          <p>👋 Nous avons besoin d’aide !</p>
          <div className="layout-center">
            <ButtonLink
              to="https://startupdetat.typeform.com/to/gyOD5443"
              target="_blank"
              small
            >
              Aidez-nous en répondant à notre questionnaire
            </ButtonLink>
            <br />
          </div>
          <div
            className="close-modal"
            dangerouslySetInnerHTML={{
              __html: `
            <button onclick="window.closeModal('survey-banner')" style="box-shadow:none; padding: 0;outline: none;border: none;background-color: transparent;">
            <b>✕</b>
            </button>
            `,
            }}
          />
        </div>
      </div>
    </div>

    <style jsx>{`
      #survey-banner {
        z-index: 100;
        position: fixed;
        margin: auto;
        display: block;
        width: 100%;
        bottom: 0;
        display: none;
        font-size: 0.9rem;
        align-items: center;
        justify-content: center;
         {
          /* transition: bottom 300ms cubic-bezier(0.175, 0.885, 0.32, 1.125); */
        }
      }

      .modal {
        background-color: #fff;
        position: relative;
        display: inline-block;
        margin: auto;
        padding: 20px;
        padding-top: 0;
        text-align: center;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        box-shadow: 0px 50px 200px -30px #000;
        border: 2px solid ${constants.colors.frBlue};
        border-bottom: none;
        background-color: #fffde6;
      }

      .close-modal {
        position: absolute;
        top: 10px;
        right: 10px;
      }
    `}</style>
  </>
);
