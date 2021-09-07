import React from 'react';
import randomId from '../../utils/helpers/randomId';
import Head from 'next/head';
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
      <Head>
        <script async src="/resources/partials/button-async/dist/index.js" />
      </Head>
      <div
        dangerouslySetInnerHTML={{
          __html: `<partial-button-async to="${to}" clean="${id}" />`,
        }}
      />
    </div>
  );
};

export default ButtonLinkAsync;
