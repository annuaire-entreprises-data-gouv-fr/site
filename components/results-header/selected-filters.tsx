import SearchFilterParams, { IParams } from '../../models/search-filter-params';

const Filter: React.FC<{
  label?: string;
  icon?: JSX.Element;
  url: string;
}> = ({ label, icon = null, url }) => (
  <div className="selected-filter-container">
    {icon}&nbsp;
    {label}&nbsp;
    <a href={url}>
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
    `}</style>
  </div>
);

const SelectedFilters: React.FC<{
  searchFilterParams: IParams;
}> = ({ searchFilterParams }) => {
  const searchParams = new SearchFilterParams(searchFilterParams);
  return (
    <div>
      {searchParams.toFilters().map(({ icon, label, url }) => (
        <Filter icon={icon} label={label} url={url} />
      ))}
      <style jsx>{`
        div {
          margin-left: 5px;
          flex-grow: 1;
          display: flex;
          align-items: start;
          gap: 5px;
        }
      `}</style>
    </div>
  );
};

export default SelectedFilters;
