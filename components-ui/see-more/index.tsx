'use client';

import { useId, useState } from 'react';
import ButtonLink from '#components-ui/button';

type IProps = {
  children: React.ReactNode;
  'aria-label'?: string;
};

export default function SeeMore(props: IProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const id = useId();
  return (
    <>
      <div className="flex flex-col">
        <div
          className={isExpanded ? 'expanded' : 'collapsed'}
          aria-expanded={isExpanded}
          aria-hidden={!isExpanded}
          id={id}
        >
          {props.children}
        </div>
        <ButtonLink
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={props['aria-label'] || 'Voir toutes les informations'}
          aria-controls={id}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Voir moins' : 'Voir plus'}
        </ButtonLink>
      </div>
      <style jsx>{`
        .expanded {
        }
        .collapsed {
          height: 3rem;
          position: relative;
        }
        .collapsed::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1rem;
          background: linear-gradient(rgba(255, 255, 255, 0), #fff);
        }
      `}</style>
    </>
  );
}
