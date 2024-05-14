'use client';

import { Loader } from '#components-ui/loader';
import { useTimeout } from 'hooks';

export function PageLoader() {
  const before100ms = !useTimeout(100);
  if (before100ms) {
    return <div style={{ minHeight: '300px' }} />;
  }

  return (
    <>
      Chargement des données en cours <Loader />
    </>
  );
}
