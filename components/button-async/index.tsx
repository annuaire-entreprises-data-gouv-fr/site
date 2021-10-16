import React from 'react';
import randomId from '../../utils/helpers/randomId';
import ButtonLink from '../button';
import { download } from '../icon';

/**
 * Render both a static version of the component and a custom element to be rendered by the preact partial
 *
 * Static can get cleaned by the preact partial script
 * @param param0
 * @returns
 */
const ButtonLinkAsync: React.FC<{ to: string }> = ({ to }) => {
  const id = randomId();
  return (
    <div>
      <span id={id}>
        <ButtonLink nofollow={true} target="_blank" to={to}>
          {download} Télécharger le justificatif d’immatriculation
        </ButtonLink>
      </span>
      <div
        dangerouslySetInnerHTML={{
          __html: `
          <div class="button-link" x-data="asyncButton('${to}')" x-cloak x-init="function() {init('${id}')}">
            <div class="error-message" x-show="error !== null" x-text="error"></div>
            <button @click="click">
              <template x-if="!isLoading">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </template>
              <template x-if="!isLoading">
                <span>Télécharger le justificatif d’immatriculation</span>
              </template>
              <template x-if="isLoading">
                <div class="loader">
                  <span></span>
                  <span></span>
                </div>
              </template>
              <template x-if="isLoading">
                <i>Téléchargement en cours</i>
              </template>
            </button>
          </div>
          `,
        }}
      />
      <style global jsx>{`
        .button-link .error-message {
          color: red;
          font-size: 0.9rem;
          font-weight: bold;
        }

        .button-link button {
          cursor: 'pointer';
          flex-direction: 'row';
          display: 'flex';
        }

        .loader {
          margin: auto;
          width: 25px;
          height: 25px;
          display: inline-block;
          padding: 0px;
          text-align: left;
        }
        .loader span {
          position: absolute;
          display: inline-block;
          width: 25px;
          height: 25px;
          border-radius: 100%;
          background: #fff;
          -webkit-animation: loader 1s linear infinite;
          animation: loader 1s linear infinite;
        }
        .loader span:last-child {
          animation-delay: -0.4s;
          -webkit-animation-delay: -0.4s;
        }

        .loader-container > .message {
          font-style: italic;
          margin: 20px auto;
        }
        @keyframes loader {
          0% {
            transform: scale(0, 0);
            opacity: 0.8;
          }
          100% {
            transform: scale(1, 1);
            opacity: 0;
          }
        }
        @-webkit-keyframes loader {
          0% {
            -webkit-transform: scale(0, 0);
            opacity: 0.8;
          }
          100% {
            -webkit-transform: scale(1, 1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ButtonLinkAsync;
