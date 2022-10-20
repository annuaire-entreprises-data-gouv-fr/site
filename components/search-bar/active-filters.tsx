const ActiveFilter: React.FC<{
  label?: string;
  icon?: JSX.Element;
  query: string;
}> = ({ label, icon = null, query }) => (
  <div className="selected-filter-container">
    {icon}&nbsp;{label}
    <a className="no-style-link" href={query}>
      <b>✕</b>
    </a>
    <style jsx>{`
      .selected-filter-container {
        display: flex;
        align-items: center;
        padding: 3px 5px;
        color: #000091;
        background-color: #dfdff1;
        border-radius: 5px;
      }
      .selected-filter-container b {
        margin: 0 5px;
      }
    `}</style>
  </div>
);

export default ActiveFilter;
