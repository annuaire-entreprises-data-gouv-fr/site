import type React from "react";

const generateFAQuestion = (question: string, answer: string): String => `{
    "@type": "Question",
    "name": ${JSON.stringify(question)},
    "acceptedAnswer": {
      "@type": "Answer",
      "text": ${JSON.stringify(answer)}
    }
  }`;

const StructuredDataFAQ: React.FC<{ data: string[][] }> = ({ data }) => (
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
  ></script>
);

export default StructuredDataFAQ;
