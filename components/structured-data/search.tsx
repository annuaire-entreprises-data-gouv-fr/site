import { getNonce } from "#utils/server-side-helper/app/headers/nonce";

const StructuredDataSearchAction = async () => {
  const nonce = await getNonce();
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": "https://annuaire-entreprises.data.gouv.fr",
        "potentialAction": [{
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://annuaire-entreprises.data.gouv.fr/rechercher?terme={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://annuaire-entreprises.data.gouv.fr/rechercher/carte?terme={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }]
      }`,
      }}
      nonce={nonce}
      type="application/ld+json"
    />
  );
};

export default StructuredDataSearchAction;
