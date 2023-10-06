import React from 'react';
import constants from '#models/constants';

const formLink = '';

export const WeNeedYouModal: React.FC<{}> = () => (
  <>
    <div
      id="we-need-you-modal"
      role="dialog"
      aria-label="Donnez-nous votre avis"
      className="hide"
    >
      <div className="modal">
        <div className="title">
          <div>🙃</div>
          <div>
            <b>On a besoin de vous !</b>
            <br />
            <i>(pendant 30 sec)</i>
          </div>
        </div>
        <div className="layout-center">
          <div
            dangerouslySetInnerHTML={{
              __html: `
              <a style="background-color:#fff; color:#000091; padding:5px;" onclick="window.closeModal('we-need-you-modal')"  href="${formLink}" target="_blank">
                Répondez à nos questions
              </a>`,
            }}
          />
        </div>
        <div
          className="close-modal"
          dangerouslySetInnerHTML={{
            __html: `
            <button onclick="window.closeModal('we-need-you-modal')" style="box-shadow:none;font-family: 'Marianne', sans-serif;padding: 0;outline: none;border: none;background-color: transparent;">
            <b>fermer ✕</b>
            </button>
            `,
          }}
        />
      </div>
    </div>

    <style jsx>{`
      #we-need-you-modal {
        z-index: 300;
        color: #fff;
        background: transparent;
        position: fixed;
        right: 0;
        top: 200px;
        overflow: scroll;
        display: none;
      }

      #we-need-you-modal.hide > .modal {
        opacity: 0;
        transform: translateX(300px);
      }

      .modal {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        transition: all 200ms ease-out;
        background-color: ${constants.colors.frBlue};
        padding: 20px;
        padding-top: 40px;
        opacity: 1;
        visibility: visible;
        transform: translateX(0px);
      }

      .close-modal {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .title {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
      }
      .title > div:first-of-type {
        font-size: 2.3rem;
        padding-right: 5px;
      }
      .title > div:nth-of-type(2) > b {
        font-size: 1.1rem;
      }

      .background-close-modal {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 100%;
      }

      @media only screen and (min-width: 1px) and (max-width: 576px) {
        #we-need-you-modal {
          bottom: 0;
          top: initial;
          width: 100%;
        }

        #we-need-you-modal.hide > .modal {
          opacity: 0;
          transform: translateY(300px);
        }
        .modal {
          border-radius: 0;
          bottom: 0;
          transform: translateY(0px);
        }
      }
    `}</style>
  </>
);
