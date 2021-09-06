import React from 'react';
import ButtonLink from '../button';
import { download } from '../icon';

const ButtonLinkAsync: React.FC<{ to: string }> = ({ to }) => {
  return (
    <div>
      <div>
        <ButtonLink nofollow={true} target="_blank" to={to}>
          {download} Télécharger le justificatif d’immatriculation
        </ButtonLink>
      </div>
      {/* <script
        async
        src="/resources/partials/button-async/dist/index.js"
      ></script>
      <div
        dangerouslySetInnerHTML={{
          __html: `
        <partial-button-async to="${to}" />
      `,
        }}
      /> */}
    </div>
  );
};

export default ButtonLinkAsync;
