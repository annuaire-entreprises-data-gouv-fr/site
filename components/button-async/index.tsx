import React from 'react';
import randomId from '../../utils/helpers/randomId';
import ButtonLink from '../button';
import { download } from '../icon';

const ButtonLinkAsync: React.FC<{ to: string }> = ({ to }) => {
  const id = randomId();

  return (
    <div>
      <script
        async
        src="/resources/partials/button-async/dist/index.js"
      ></script>
      <div id={id}>
        <ButtonLink nofollow={true} target="_blank" to={to}>
          {download} Télécharger le justificatif d’immatriculation
        </ButtonLink>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: `<partial-button-async to="${to}" clean="${id}" />`,
        }}
      />
    </div>
  );
};

export default ButtonLinkAsync;
