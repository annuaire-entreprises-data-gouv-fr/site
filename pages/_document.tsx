import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class CustomHead extends Head {
  render() {
    const res = super.render();

    function transform(node: any): any {
      // remove link preloads and next.js script
      const isLinkPreload =
        node &&
        node.type === 'link' &&
        node.props &&
        node.props.rel === 'preload';

      const isNextScript =
        node &&
        node.type === 'script' &&
        node.props &&
        node.props.src.indexOf('/_next/static') > -1;

      if (isLinkPreload || isNextScript) {
        return null;
      }
      if (node && node.props && node.props.children) {
        return {
          ...node,
          props: {
            ...node.props,
            children: node.props.children.map(transform),
          },
        };
      }
      if (Array.isArray(node)) {
        return node.map(transform);
      }

      return node;
    }

    return transform(res);
  }
}

class DevDocument extends Document {
  render() {
    return (
      <Html lang="fr">
        <Head>
          <link rel="stylesheet" href="/resources/css/dsfr.min.css" />
          <link
            rel="apple-touch-icon"
            href="/resources/favicons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            href="/resources/favicons/favicon.svg"
            type="image/svg+xml"
          />
          <link
            rel="shortcut icon"
            href="/resources/favicons/favicon.ico"
            type="image/x-icon"
          />
          <link
            rel="manifest"
            href="/resources/favicons/manifest.webmanifest"
            cross-origin="use-credentials"
          />
          <script
            defer
            type="text/javascript"
            src="/resources/js/alpine-helpers.js"
          ></script>
          <script
            defer
            type="text/javascript"
            src="/resources/js/alpine.min.js"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
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
          <link rel="stylesheet" href="/resources/css/dsfr.min.css" />
          <link
            rel="apple-touch-icon"
            href="/resources/favicons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            href="/resources/favicons/favicon.svg"
            type="image/svg+xml"
          />
          <link
            rel="shortcut icon"
            href="/resources/favicons/favicon.ico"
            type="image/x-icon"
          />
          <link
            rel="manifest"
            href="/resources/favicons/manifest.webmanifest"
            cross-origin="use-credentials"
          />
          <script
            defer
            type="text/javascript"
            src="/resources/js/bundle.js"
          ></script>
          <script
            defer
            type="text/javascript"
            src="/resources/js/alpine.min.js"
          ></script>
          {process.env.NODE_ENV === 'production' &&
            process.env.MATOMO_SITE_ID && (
              <script defer src="/resources/js/init-piwik.js"></script>
            )}
        </CustomHead>

        <body>
          <Main />
        </body>
      </Html>
    );
  }
}

export default process.env.NODE_ENV === 'production'
  ? StaticDocument
  : DevDocument;
