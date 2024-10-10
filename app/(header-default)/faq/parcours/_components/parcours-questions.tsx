'use client';

import { MultiChoice } from '#components-ui/multi-choice';
import Question, { EQuestionType } from '#components/faq-parcours/question';
import { FAQTargets, allFaqArticlesByTarget } from '#models/article/faq';
import { useRef, useState } from 'react';

type IProps = {
  question: EQuestionType;
};
export default function ParcoursQuestions({ question }: IProps) {
  const initialQuestionType = Object.values(EQuestionType).indexOf(question)
    ? question
    : null;

  const scrollRef = useRef<HTMLSpanElement | null>(null);

  const [userType, setUserType] = useState(initialQuestionType ? 'all' : '');
  const [questionType, setQuestionType] = useState<EQuestionType>(
    initialQuestionType || EQuestionType.NONE
  );

  const scroll = () => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const updateQuestion = (q: EQuestionType) => {
    setQuestionType(q);
    scroll();
  };
  return (
    <>
      <MultiChoice
        idPrefix="user-type"
        values={[...Object.entries(FAQTargets), ['all', 'Autres']].map(
          ([key, value]) => {
            return {
              label: value,
              onClick: () => {
                setUserType(key);
                updateQuestion(EQuestionType.NONE);
              },
              checked: userType === key,
            };
          }
        )}
      />
      <span ref={scrollRef} />
      {userType && (
        <Question
          questionType={questionType}
          setQuestionType={updateQuestion}
          questions={
            userType ? Object.values(allFaqArticlesByTarget[userType]) : []
          }
          userType={userType}
        />
      )}
    </>
  );
}
