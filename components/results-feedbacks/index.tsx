import React from 'react';

/**
 * This component get hydrated in frontend with frontend bundle
 * @returns
 */

export const ResultsFeedback: React.FC<{}> = () => (
  <div id="results-feedbacks">
    👋 Bonjour ! On aimerait bien savoir : avez-vous trouvé la structure que
    vous recherchez ?
    <br />
    <br />
    <div
      dangerouslySetInnerHTML={{
        __html: `
              <button onclick="window.logResearchFeedback(1)">
                Oui
              </button>/
              <button onclick="window.logResearchFeedback(0)">
                Non
              </button>`,
      }}
    />
    <style global jsx>{`
      #results-feedbacks {
        width: 100%;
        max-width: 300px;
        background-color: #dfdff1;
        border-radius: 6px;
        color: #000091;
        padding: 10px 20px 20px;
        display: none;
      }

      #results-feedbacks button {
        background: none;
        color: inherit;
        font-size: inherit;
        font-weight: bold;
        text-decoration: underline;
      }

      @media only screen and (min-width: 1px) and (max-width: 900px) {
        #results-feedbacks {
          max-width: 100%;
        }
      }
    `}</style>
  </div>
);
