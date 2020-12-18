import React from 'react';
import App from 'next/app';

import '../static/globals.scss';

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
