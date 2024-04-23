'use client';

import { useId, useState } from 'react';
import FadeIn from '#components-ui/animation/fade-in';
import ButtonLink from '#components-ui/button';
import styles from './style.module.css';

type IProps = {
  children: React.ReactNode;
  'aria-label'?: string;
  label?: string;
};

export default function SeeMore(props: IProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const id = useId();
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <ButtonLink
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={props['aria-label'] || 'Voir toutes les informations'}
          aria-controls={id}
          small
          alt
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Voir moins' : 'Voir plus'}
        </ButtonLink>
      </div>
      <div
        className={isExpanded ? styles['expanded'] : styles['collapsed']}
        aria-expanded={isExpanded}
        aria-hidden={!isExpanded}
        id={id}
      >
        <FadeIn key={'' + isExpanded}>{props.children}</FadeIn>
      </div>
    </>
  );
}
