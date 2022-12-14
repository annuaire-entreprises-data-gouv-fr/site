import Document, { Html, Head, Main } from 'next/document';
import React from 'react';

const manifest = (
  process.env.NODE_ENV === 'production'
    ? require('../public/manifest.json')
    : {}
) as { [key: string]: any };

class CustomHead extends Head {
  render() {
    const { head, styles } = this.context;
    const children = this.props.children;
    this.context.docComponentsRendered.Head = true;
    this.context.docComponentsRendered.NextScript = true;
    return (
      <head {...this.props}>
        {children}
        {head}
        {styles}
      </head>
    );
  }
}

class DevDocument extends Document {
  render() {
    return (
      <Html lang="fr">
        <CustomHead>
          <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
          <link rel="icon" href="/favicons/favicon.svg" type="image/svg+xml" />
          <link
            rel="shortcut icon"
            href="/favicons/favicon.ico"
            type="image/x-icon"
          />
          <link
            rel="manifest"
            href="/favicons/manifest.webmanifest"
            cross-origin="use-credentials"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="http://localhost:3001/frontend/style/dsfr.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="http://localhost:3001/frontend/style/globals.css"
          />
          <script
            defer
            type="module"
            src="http://localhost:3001/@vite/client"
          ></script>
          <script
            defer
            type="module"
            src="http://localhost:3001/frontend/src/index.js"
          ></script>
        </CustomHead>
        <body>
          <Main />
        </body>
      </Html>
    );
  }
}

class StaticDocument extends Document {
  render() {
    return (
      <Html lang="fr">
        <CustomHead>
          {/* Standard Meta */}
          {/* https://gouvfr.atlassian.net/wiki/spaces/DB/pages/223019574/D+veloppeurs */}
          <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
          <link rel="icon" href="/favicons/favicon.svg" type="image/svg+xml" />
          <link
            rel="shortcut icon"
            href="/favicons/favicon.ico"
            type="image/x-icon"
          />
          <link
            rel="manifest"
            href="/favicons/manifest.webmanifest"
            cross-origin="use-credentials"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href={`/${manifest['style/dsfr.min.css'].file}`}
          />
          <link
            rel="stylesheet"
            type="text/css"
            href={`/${manifest['style/globals.css'].file}`}
          />
          <script
            defer
            type="module"
            src={`/${manifest['src/index.js'].file}`}
          ></script>
        </CustomHead>
        <body>
          <Main />
          {process.env.NODE_ENV === 'production' &&
            process.env.MATOMO_SITE_ID && (
              <script
                dangerouslySetInnerHTML={{
                  __html: `
              var _paq = window._paq || [];
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function () {
                var u = 'https://stats.data.gouv.fr/';
                _paq.push(['setTrackerUrl', u + 'piwik.php']);
                _paq.push(['setSiteId', ${process.env.MATOMO_SITE_ID}]);
                var d = document,
                  g = d.createElement('script'),
                  s = d.getElementsByTagName('script')[0];
                g.type = 'text/javascript';
                g.async = true;
                g.defer = true;
                g.src = u + 'piwik.js';
                s.parentNode.insertBefore(g, s);
              })();
              `,
                }}
              ></script>
            )}
        </body>
      </Html>
    );
  }
}

export default process.env.NODE_ENV === 'production'
  ? StaticDocument
  : DevDocument;
