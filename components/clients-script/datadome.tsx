import React from 'react';

const InitDataDome = (
  <script
    dangerouslySetInnerHTML={{
      __html: `
          !function (a, b, c, d, e, f) {
              a.ddjskey = e;
              a.ddoptions = f || null;
              var m = b.createElement(c), n = b.getElementsByTagName(c)[0];
              m.async = 1, m.src = d, n.parentNode.insertBefore(m, n);
          }(window, document, "script", "https://js.datadome.co/tags.js",${process.env.DATADOME_CLIENT_KEY}, { ajaxListenerPath: true });
            `,
    }}
  />
);
export default InitDataDome;
