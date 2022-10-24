const ActiveFilter: React.FC<{
  label?: string;
  icon?: JSX.Element;
  query: string;
}> = ({ label, icon = null, query }) => (
  <div className="selected-filter-container cursor-pointer">
    {icon}&nbsp;{label}
    <a className="no-style-link" href={query}>
      <b>✕</b>
    </a>
    <style jsx>{`
      .selected-filter-container {
        display: flex;
        align-items: center;
        padding: 5px 10px;
        color: #000091;
        background-color: #dfdff1;
        border-radius: 5px;
        border: 1px solid #dfdff1;
      }
      .selected-filter-container:hover {
        border-color: #0a76f6;
      }

      .selected-filter-container b {
        margin: 0 5px;
      }
    `}</style>
  </div>
);

export default ActiveFilter;
