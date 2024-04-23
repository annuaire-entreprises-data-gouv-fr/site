import FloatingHelpButton from '#components-ui/floating-help-button';
import { Icon } from '#components-ui/icon/wrapper';

export function Question() {
  return (
    <FloatingHelpButton>
      <a
        className="no-style-link"
        href="/faq/parcours"
        data-test-id="question-faq"
        aria-label="Une question ? Accéder à la FAQ."
      >
        <span>Une question&nbsp;</span>
        <Icon size={24} slug="questionFill"></Icon>
      </a>
    </FloatingHelpButton>
  );
}
