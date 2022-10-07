import { extractFilters, IParams } from '../../models/search-filter-params';

const Filter: React.FC<{
  label?: string;
  icon?: JSX.Element;
  url: string;
}> = ({ label, icon = null, url }) => (
  <div className="selected-filter-container">
    {icon}
    <span
      dangerouslySetInnerHTML={{
        __html: `<span class="advanced-search-filter" onclick="window.openAdvancedSearch()">&nbsp;
    ${label}&nbsp;</span>`,
      }}
    />
    <a className="no-style-link" href={url}>
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
      .selected-filter-container span {
        cursor: pointer;
      }
      .selected-filter-container b {
        margin: 0 5px;
      }
    `}</style>
  </div>
);

const SelectedFilters: React.FC<{
  searchFilterParams: IParams;
  searchTerm: string;
}> = ({ searchFilterParams, searchTerm }) => {
  return (
    <div>
      {extractFilters(searchFilterParams).map(({ icon, label, url }) => (
        <Filter icon={icon} label={label} url={`?terme=${searchTerm}${url}`} />
      ))}
      <style jsx>{`
        div {
          margin-left: 5px;
          flex-grow: 1;
          display: flex;
          align-items: start;
          flex-wrap: wrap;
          gap: 5px;
        }
      `}</style>
    </div>
  );
};

export default SelectedFilters;
