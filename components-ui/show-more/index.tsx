'use client';

import { CSSProperties, useId, useState } from 'react';
import ButtonLink from '#components-ui/button';
import styles from './style.module.css';

type IProps = {
  children: React.ReactNode;
  collapsedHeight?: CSSProperties['maxHeight'];
  'aria-label'?: string;
  label?: string;
};

/*

Design point of attention:
- Children's height can be huge, so the « Voir moins » button should'nt be at the bottom of the children
- The children should be collapsed by default

*/

export default function ShowMore(props: IProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const id = useId();
  const collapsedHeight = props.collapsedHeight ?? '30rem';
  return (
    <div
      className={isExpanded ? styles['expanded'] : styles['collapsed']}
      style={
        {
          '--collapsed-height': collapsedHeight,
        } as CSSProperties
      }
    >
      <div className={styles['content']}>{props.children}</div>
      <div className={styles['button-container']}>
        <ButtonLink
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={props['aria-label'] || 'Voir toutes les informations'}
          alt
          described-by={id}
        >
          {isExpanded ? 'Voir moins' : 'Voir plus'}
        </ButtonLink>
        <p id={id} className="fr-sr-only">
          {!isExpanded ? 'Affiche le texte caché' : 'Cache une partie du texte'}{' '}
          pour les utilisateurs voyants, mais le texte est déjà accessible en
          entier pour les lecteurs d’écran.
        </p>
      </div>
    </div>
  );
}
