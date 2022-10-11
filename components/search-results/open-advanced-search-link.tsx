const OpenAdvancedSearchLink = ({ label = '' }) => (
  <span
    dangerouslySetInnerHTML={{
      __html: `<span class="cursor-pointer dont-close-advanced-search" onclick="window.openAdvancedSearch()">
      ${label}</span>`,
    }}
  />
);

export default OpenAdvancedSearchLink;
