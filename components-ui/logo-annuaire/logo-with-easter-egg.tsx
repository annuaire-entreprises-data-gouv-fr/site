'use client';

import { useEffect, useState } from 'react';
import { LogoAnnuaire, LogoAnnuaireGif } from './logo-annuaire';

//Haut, haut, bas, bas, gauche, droite, gauche, droite, B, A
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

export const LogoAnnuaireWithEasterEgg = () => {
  const [showGif, setShowGif] = useState(false);

  useEffect(() => {
    let counter = 0;

    const keyDown = function (e: KeyboardEvent) {
      if (e.keyCode === konami[counter++]) {
        if (counter === konami.length) {
          counter = 0;
          setShowGif(true);
        }
      } else {
        counter = 0;
      }
    };

    document.addEventListener('keydown', keyDown);

    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, []);

  return showGif ? <LogoAnnuaireGif /> : <LogoAnnuaire />;
};
