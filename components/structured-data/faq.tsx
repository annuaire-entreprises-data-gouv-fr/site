import React from 'react';

const generateFAQuestion = (question: string, answer: string): String => {
  return `{
    "@type": "Question",
    "name": ${JSON.stringify(question)},
    "acceptedAnswer": {
      "@type": "Answer",
      "text": ${JSON.stringify(answer)}
    }
  }`;
};

const StructuredDataFAQ: React.FC<{ data: string[][] }> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: `{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [${data
          .map((elem) => generateFAQuestion(elem[0], elem[1]))
          .join(',')}]
      }
      `,
    }}
  ></script>
);

export default StructuredDataFAQ;
