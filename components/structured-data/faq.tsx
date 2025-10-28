import { getNonce } from "#utils/server-side-helper/headers/nonce";

const generateFAQuestion = (question: string, answer: string): String => `{
    "@type": "Question",
    "name": ${JSON.stringify(question)},
    "acceptedAnswer": {
      "@type": "Answer",
      "text": ${JSON.stringify(answer)}
    }
  }`;

const StructuredDataFAQ = async ({ data }: { data: string[][] }) => {
  const nonce = await getNonce();
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [${data
          .map((elem) => generateFAQuestion(elem[0], elem[1]))
          .join(",")}]
      }
      `,
      }}
      nonce={nonce}
      type="application/ld+json"
    />
  );
};

export default StructuredDataFAQ;
