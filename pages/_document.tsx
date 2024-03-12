import Document, { Head, Html, Main, NextScript } from 'next/document';
import { MatomoInit } from '#components/matomo-event/init';

class CustomDocument extends Document {
  render() {
    const isProd = process.env.NODE_ENV === 'production';
    const session =
      this.props['__NEXT_DATA__']?.props?.pageProps?.metadata?.session;
    return (
      <Html lang="fr">
        <Head />
        <body>
          <Main />
          {isProd && process.env.MATOMO_SITE_ID && (
            <MatomoInit session={session} />
          )}
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
