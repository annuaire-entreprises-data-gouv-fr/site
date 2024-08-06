/**
 * Log an event in matomo but rendered from server side
 * @param param0
 * @returns
 */
const MatomoEvent: React.FC<{
  category: string;
  action: string;
  name: string;
}> = ({ category, action, name }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: `
        <script>
          var _paq = window._paq || [];
          _paq.push([
              'trackEvent',
              '${category}',
              '${action}',
              '${name}',
          ]);
        </script>
        `,
    }}
  ></div>
);
export default MatomoEvent;
