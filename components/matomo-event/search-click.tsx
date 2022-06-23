import React from 'react';
import { serializeForClientScript } from '../../utils/helpers/formatting';

interface IProps {
  position: number;
  resultCount: number;
  isAdvancedSearch: boolean;
  searchTerm: string;
}

const MatomoEventSearchClick: React.FC<IProps> = ({
  position,
  isAdvancedSearch,
  resultCount,
  searchTerm,
}) => (
  <div
    dangerouslySetInnerHTML={{
      __html: `
        <script>
            var links = document.getElementsByClassName("result-link");
            for (let i = 0; i < links.length; i++) {
            links[i].addEventListener("click", function() {
                if (typeof window !== 'undefined' && window._paq) {
                var position = 10*${position}+i+1;
                var siren = links[i].attributes['data-siren'].value;

                window._paq.push([
                    'trackEvent',
                    'research:click',
                    '${serializeForClientScript(searchTerm)}',
                    'selectedSiren='+siren+'-position='+position+'-resultCount='+${resultCount}+'-advancedSearch='+${isAdvancedSearch},
                ]);
                }
            });
            }
        </script>
        `,
    }}
  ></div>
);

export default MatomoEventSearchClick;
