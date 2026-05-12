/**
 * Log an event in matomo but rendered from server side
 * @param param0
 * @returns
 */
const MatomoEvent = ({
  category,
  action,
  name,
}: {
  category: string;
  action: string;
  name: string;
}) => (
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
  />
);
export default MatomoEvent;
