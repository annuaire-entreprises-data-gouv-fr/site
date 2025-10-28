import { getNonce } from "#utils/server-side-helper/app/headers/nonce";

/**
 * Log an event in matomo but rendered from server side
 * @param param0
 * @returns
 */
const MatomoEvent = async ({
  category,
  action,
  name,
}: {
  category: string;
  action: string;
  name: string;
}) => {
  const nonce = await getNonce();
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          var _paq = window._paq || [];
          _paq.push([
              'trackEvent',
              '${category}',
              '${action}',
              '${name}',
          ]);
        `,
      }}
      nonce={nonce}
    />
  );
};
export default MatomoEvent;
