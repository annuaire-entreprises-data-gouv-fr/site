import React from 'react';
import App from 'next/app';

// import * as Sentry from '@sentry/node';

import '../static/globals.scss';


if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  // Sentry.init({
  //   enabled: process.env.NODE_ENV === 'production',
  //   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // });
}
class MyApp extends App {
  render() {
    //@ts-ignore
    const { Component, pageProps, err } = this.props;

    return (
      <>
        <Component {...pageProps} err={err} />
      </>
    );
  }
}
export default MyApp;
