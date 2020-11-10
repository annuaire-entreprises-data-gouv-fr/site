import React from 'react';

interface IFAQuestion {
  '@type': 'Question';
  name: String;
  acceptedAnswer: {
    '@type': 'Answer';
    text: String;
  };
}

const generateFAQuestion = (question: string, answer: string): IFAQuestion => {
  return {
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  };
};

interface IProps {
  data: string[][];
}

export default ({ data }: IProps) => (
  <script type="application/ld+json">
    {{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [data.map((elem) => generateFAQuestion(elem[0], elem[1]))],
    }}
  </script>
);
