import React from 'react';
import { serializeForClientScript } from '../../utils/helpers/formatting';

/**
 * This component get hydrated in frontend with frontend bundle
 * @returns
 */
export const SearchFeedback: React.FC<{ searchTerm: string }> = ({
  searchTerm = '',
}) => (
  <div id="search-feedback">
    <div
      dangerouslySetInnerHTML={{
        __html: `
              <span class="close" onclick="window.closeModal('search-feedback')">
              ✕
              </span>`,
      }}
    />
    👋 Bonjour ! On aimerait savoir : avez-vous trouvé la structure que vous
    recherchez ?
    <span
      dangerouslySetInnerHTML={{
        __html: `
              <button onclick="window.logResearchFeedback(1, '${serializeForClientScript(
                searchTerm
              )}')">
                Oui
              </button>/
              <button onclick="window.logResearchFeedback(0, '${serializeForClientScript(
                searchTerm
              )}')">
                Non
              </button>`,
      }}
    />
    <style global jsx>{`
      #search-feedback {
        background-color: #fffde6;
        border-radius: 3px;
        color: #000091;
        margin: 20px 0 10px;
        padding: 10px 20px;
        display: none;
        position: relative;
      }

      #search-feedback span.close {
        font-weight: bold;
        position: absolute;
        right: 5px;
        top: 0px;
        padding: 10px;
        cursor: pointer;
      }

      #search-feedback button {
        background: none;
        color: inherit;
        font-size: inherit;
        font-weight: bold;
        text-decoration: underline;
      }

      @media only screen and (min-width: 1px) and (max-width: 900px) {
        #search-feedback {
          margin-top: 20px;
          max-width: 100%;
        }
      }
    `}</style>
  </div>
);
