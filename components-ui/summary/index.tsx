type ISummaryProps = {
  headings: Array<{
    id: string;
    content: string;
  }>;
};

export default function Summary(props: ISummaryProps) {
  if (props.headings.length === 0) {
    return null;
  }
  return (
    <nav
      className="fr-summary"
      role="navigation"
      aria-labelledby="fr-summary-title"
    >
      <p className="fr-summary__title" id="fr-summary-title">
        Sommaire
      </p>
      <ol className="fr-summary__list">
        {props.headings.map(({ id, content }) => (
          <li key={id}>
            <a className="fr-summary__link" href={`#${id}`}>
              {content}{' '}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
