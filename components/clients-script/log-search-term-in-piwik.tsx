import React from 'react';

interface IProps {
  searchTerm: string;
  resultCount: number;
}

const LogSearchTermInPiwik: React.FC<IProps> = ({
  searchTerm,
  resultCount,
}) => (
  <script
    async
    defer
    dangerouslySetInnerHTML={{
      __html: `
      function logSearch () {
        if(window.Piwik) {
          var tracker = window.Piwik.getTracker();
          if (tracker) {
            tracker.trackSiteSearch("${searchTerm}", "${'carte'}", ${resultCount});
          }
        }
      }
      window.setTimeout(logSearch, 500);
      `,
    }}
  />
);

export default LogSearchTermInPiwik;
