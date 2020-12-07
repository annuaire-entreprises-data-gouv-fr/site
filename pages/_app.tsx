import React from 'react';
import App from 'next/app';
import Error from 'next/error';

import '../static/globals.scss';
// import '@gouvfr/design-system/dist/css/dsfr.min.css';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Component {...pageProps} />
      </>
    );
  }
}
export default MyApp;
