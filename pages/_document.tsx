import Document, { Head, Html, Main, NextScript } from 'next/document';
import { MatomoInit } from '#components/matomo-event/init';

class CustomDocument extends Document {
  render() {
    const isMatomoEnabled = process.env.MATOMO_ENABLED === 'enabled';
    const session =
      this.props['__NEXT_DATA__']?.props?.pageProps?.metadata?.session;
    return (
      <Html lang="fr" suppressHydrationWarning>
        <Head />
        <body>
          {isMatomoEnabled && process.env.MATOMO_SITE_ID && (
            <MatomoInit session={session} />
          )}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
