'use client';

import { useEffect } from 'react';
import constants from '#models/constants';

export default function LoadBar({ isAgent }: { isAgent: boolean }) {
  useEffect(() => {
    const loadBar = loadBarFactory();
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', loadBar.run);
    }
  }, []);
  return (
    <div
      id="loader-bar"
      style={{
        background: isAgent ? constants.colors.espaceAgent : 'transparent',
        transition: 'width 300ms ease-in-out',
        height: '3px',
        position: 'fixed',
        top: '0',
        width: '0',
        zIndex: '10000',
      }}
    />
  );
}

/**
 * Small utils that create a load bar on when user is about to leave page.
 *
 * Fist 400ms nothing happens and then a load bar is displayed that last around 5 seconds
 *
 * Load bar is entirely a visual trick to help with user patience.
 */

const wait = async (timeout: number): Promise<void> => {
  return new Promise((resolve) => window.setTimeout(() => resolve(), timeout));
};

/**
 * Load bar position from 0 to 100%
 * first two 0 = wait 200ms before triggering load bar
 *  */
const positions = [
  0, 0, 3, 5, 10, 12, 15, 22, 28, 34, 35, 36, 38, 40, 45, 65, 66, 67, 67, 68,
  70, 73, 75, 77, 78, 80, 82, 83, 85, 86, 88, 88, 89, 90, 91, 92, 94, 94, 95,
  96, 96, 97,
];

const init = () => {
  const loader = document.getElementById('loader-bar');
  if (!loader) {
    return null;
  }

  if (loader.style.backgroundColor === 'transparent') {
    loader.style.background = '#000091';
    loader.style.background =
      'linear-gradient(90deg, rgba(0,0,145,1), rgb(0, 159, 255))';
  }

  return loader;
};

const loadBarFactory = () => {
  return {
    _currentJobId: '',
    _loader: null as HTMLElement | null,

    run: async function () {
      const jobId = Math.random().toString(16).substring(7);

      this._currentJobId = jobId;
      if (!this._loader) {
        this._loader = init();

        // cancel job if loader is not found
        if (!this._loader) {
          return;
        }
      }

      for (let w of positions) {
        // interrupt job if another job has been triggered by another beforeunload event
        if (this._currentJobId !== jobId) {
          return;
        }
        this._loader.style.width = `${w}vw`;
        await wait(200);
      }
    },
  };
};
