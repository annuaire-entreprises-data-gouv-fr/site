import React from 'react';
import App from 'next/app';

import '../static/globals.scss';
// import '@gouvfr/design-system/dist/css/dsfr.min.css';

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
