import React from 'react';

interface IFAQuestion {
  '@type': 'Question';
  name: String;
  acceptedAnswer: {
    '@type': 'Answer';
    text: String;
  };
}

const generateFAQuestion = (question: string, answer: string): String => {
  return `{
    "@type": "Question",
    "name": "${question}",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "${answer}"
    }
  }`;
};

interface IProps {
  data: string[][];
}

const StrucutredData = ({ data }: IProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: `{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [${data
          .map((elem) => generateFAQuestion(elem[0], elem[1]))
          .join(',')}]
      }`,
    }}
  ></script>
);

export default StrucutredData;
