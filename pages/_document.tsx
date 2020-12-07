import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

const INIT_STYLE = `
html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
}

#__next {
  height: 100%;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}

/* open-sans-regular - latin */
@font-face {
  font-family: 'Marianne';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/Marianne-Regular.woff2'), url('/fonts/Marianne-Regular.woff') format('woff');
}
@font-face {
  font-family: 'Marianne';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/Marianne-Bold.woff2'), url('/fonts/Marianne-Bold.woff') format('woff');
}

html,
body {
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.78);
}

html,
body,
div,
p,
span,
a {
  font-family: 'Marianne', Arial, sans-serif;
}

h1,
h2,
h3,
h4, h1 > a {
  font-family: 'Marianne', Arial, sans-serif;
}
`;

const COPY_TO_CLIPBOARD = (
  <script
    dangerouslySetInnerHTML={{
      __html: `
    (function addCopyFunction() {
      const copyList = document.getElementsByClassName('copy-to-clipboard-anchor');
      for (var i=0; i<copyList.length; i++) {
        const element = copyList[i];
        element.onclick = () => {
          element.classList.toggle('copy-done');
          var el = document.createElement('textarea');
          el.value = element.children[0].innerHTML;
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);
          window.setTimeout(function() {
            element.classList.toggle('copy-done');
          },800)
        }
      }
    })();
  `,
    }}
  />
);
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
      <Html>
        <Head>
          <style
            dangerouslySetInnerHTML={{
              __html: INIT_STYLE,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          {COPY_TO_CLIPBOARD}
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

          <link rel="icon" href="/favicon.ico" />
          <link
            rel="preload"
            href="/fonts/open-sans-v17-latin-700.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/open-sans-v17-latin-regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/source-sans-pro-v13-latin-regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/source-sans-pro-v13-latin-700.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />

          <style
            dangerouslySetInnerHTML={{
              __html: INIT_STYLE,
            }}
          />
        </CustomHead>

        <body>
          <Main />
          {process.env.NODE_ENV === 'production' && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
            <!-- Piwik -->
            var _paq = window._paq || [];
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
              var u="https://stats.data.gouv.fr/";
              _paq.push(['setTrackerUrl', u+'piwik.php']);
              _paq.push(['setSiteId', 145]);
              var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
              g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
            })();
            `,
              }}
            />
          )}

          {COPY_TO_CLIPBOARD}
        </body>
      </Html>
    );
  }
}

// export default DevDocument;

export default process.env.NODE_ENV === 'production'
  ? StaticDocument
  : DevDocument;
