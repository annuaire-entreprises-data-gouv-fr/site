const generateFAQuestion = (question: string, answer: string): String => `{
    "@type": "Question",
    "name": ${JSON.stringify(question)},
    "acceptedAnswer": {
      "@type": "Answer",
      "text": ${JSON.stringify(answer)}
    }
  }`;

const StructuredDataFAQ = ({ data }: { data: string[][] }) => (
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
    type="application/ld+json"
  />
);

export default StructuredDataFAQ;
