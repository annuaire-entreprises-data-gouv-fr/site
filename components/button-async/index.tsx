import React from 'react';
import ButtonLink from '../button';
import { download } from '../icon';

const ButtonLinkAsync: React.FC<{ href: string }> = ({ href }) => {
  const id = 'sldkf-dslfkgn-dkjg';
  return (
    <div>
      <div data-partial-widget="button-async" data-href={href}>
        <ButtonLink nofollow={true} target="_blank" href={href}>
          {download} Télécharger le justificatif d'immatriculation
        </ButtonLink>
      </div>
      <script
        async
        src="/resources/partials/button-async/dist/index.js"
      ></script>
    </div>
  );
};

export default ButtonLinkAsync;
