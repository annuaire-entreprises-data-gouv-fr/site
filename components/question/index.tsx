import { Link } from "#components/Link";
import FloatingHelpButton from "#components-ui/floating-help-button";
import { Icon } from "#components-ui/icon/wrapper";

export function Question() {
  return (
    <FloatingHelpButton>
      <Link
        aria-label="Une question ? Accéder à la FAQ."
        className="no-style-link"
        data-test-id="question-faq"
        href="/faq"
      >
        <span>Une question&nbsp;</span>
        <Icon size={24} slug="questionFill" />
      </Link>
    </FloatingHelpButton>
  );
}
