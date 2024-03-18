import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import styles from './style.module.css';

export function Question() {
  return (
    <PrintNever>
      <div
        role="dialog"
        aria-label="Une question"
        data-test-id="question-faq"
        className={styles.questionBottomRight + ' layout-center'}
      >
        <a className="no-style-link" href="/faq/parcours">
          <span>Une question&nbsp;</span>
          <Icon size={24} slug="questionFill"></Icon>
        </a>
      </div>
    </PrintNever>
  );
}
