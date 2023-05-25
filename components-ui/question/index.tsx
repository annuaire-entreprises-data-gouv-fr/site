import React from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import styles from './styles.module.scss';

export const Question: React.FC<{}> = () => (
  <PrintNever>
    <div
      role="dialog"
      aria-label="Une question"
      className={`${styles['question-bottom-right']} layout-center`}
    >
      <a className="no-style-link" href="/faq">
        <span>Une question&nbsp;</span>
        <Icon size={24} slug="questionFill"></Icon>
      </a>
    </div>
  </PrintNever>
);
