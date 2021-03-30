import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import CopyToClipboard from '../components/clients-script/copy-to-clipboard';
import DisplayFeedback from '../components/clients-script/display-feedback';
import InitPiwik from '../components/clients-script/init-piwik';

class CustomHead extends Head {
  render() {
    const res = super.render();

    function transform(node: any): any {
      // remove all link preloads
      if (
        node &&
        node.type === 'link' &&
        node.props &&
        node.props.rel === 'preload'
      ) {
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
          {/* https://gouvfr.atlassian.net/wiki/spaces/DB/pages/222331452/Designers */}
          <link
            href="/resources/css/all.min.css"
            rel="stylesheet"
            type="text/css"
          ></link>
        </Head>
        <body>
          <Main />
          <NextScript />
          {CopyToClipboard}
          {DisplayFeedback}
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
          {/* https://gouvfr.atlassian.net/wiki/spaces/DB/pages/222331452/Designers */}
          <link
            href="/resources/css/all.min.css"
            rel="stylesheet"
            type="text/css"
          ></link>
          <link
            rel="preload"
            href="/resources/fonts/Marianne-Bold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          ></link>
          <link
            rel="preload"
            href="/resources/fonts/Marianne-Regular_Italic.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          ></link>
          <link
            rel="preload"
            href="/resources/fonts/Marianne-Regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          ></link>
          <link rel="icon" href="/favicon.ico" />
        </CustomHead>

        <body>
          <Main />
          {process.env.NODE_ENV === 'production' &&
            process.env.MATOMO_SITE_ID &&
            InitPiwik}
          {CopyToClipboard}
          {DisplayFeedback}
        </body>
      </Html>
    );
  }
}

// export default DevDocument;

export default process.env.NODE_ENV === 'production'
  ? StaticDocument
  : DevDocument;
