'use client';

import { Loader } from '#components-ui/loader';
import style from './style.module.css';

export function PageLoader() {
  return (
    <div className={style.loader}>
      Chargement des données en cours <Loader />
    </div>
  );
}
