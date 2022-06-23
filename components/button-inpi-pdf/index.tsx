import React from 'react';
import randomId from '../../utils/helpers/randomId';
import ButtonLink from '../../components-ui/button';
import { download } from '../../components-ui/icon';

/**
 * Render both a static version of the component and a Alpine component that clean static if it succesfully mount
 *
 * @param param0
 * @returns
 */
const ButtonInpiPdf: React.FC<{ siren: string }> = ({ siren }) => {
  const id = randomId();
  return (
    <div id="button-inpi-pdf">
      <span id={id + '-legacy'}>
        <ButtonLink
          nofollow={true}
          target="_blank"
          to={`/api/inpi-pdf-proxy/${siren}`}
        >
          {download} Télécharger le justificatif d’immatriculation
        </ButtonLink>
      </span>
      <div
        dangerouslySetInnerHTML={{
          __html: `
          <div
            id="${id}"
            style="display:none;"
            class="button-link"
            x-data="asyncButton('${id}')">
            <div class="warning" x-text="error"></div>
            <button @click="download('${siren}')">
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
              <span>Télécharger le justificatif d’immatriculation</span>
            </button>
          </div>
          `,
        }}
      />
      <style global jsx>{`
        .button-link button {
          cursor: 'pointer';
          flex-direction: 'row';
          display: 'flex';
        }
        .warning {
          color: #b97800;
          font-weight: bold;
        }
        #button-inpi-pdf {
          white-space: initial;
        }
      `}</style>
    </div>
  );
};

export default ButtonInpiPdf;
