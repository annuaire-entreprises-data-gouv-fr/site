import { useEffect, useState } from "react";
import { MultiChoice } from "#/components-ui/multi-choice";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { ContactAnswer } from "./answers/contact";
import { ContactCompanyAnswer } from "./answers/contact-entreprise";
import { FraudAnswer } from "./answers/fraud";

interface IProps {
  user: IAgentInfo | null;
}

export const FAQTargets = {
  particulier: "Particulier",
  entreprise: "Entreprise ou auto-entreprise",
  association: "Association",
  agent: "Agent public",
  none: "Autre",
};

const questions = [
  {
    label: "Joindre une entreprise",
    key: "company",
  },
  {
    label: "Nous alerter d’une fraude ou tentative d’escroquerie",
    key: "fraud",
  },
  { label: "Autre", key: "contact" },
];

export default function ParcoursQuestions({ user }: IProps) {
  const [userType, setUserType] = useState(
    hasRights({ user }, ApplicationRights.isAgent) ? "agent" : ""
  );
  const [questionType, setQuestionType] = useState<string>("");

  useEffect(() => {
    const restore = () => {
      const saved = window.history.state?.faqChoices;
      if (saved && Object.hasOwn(FAQTargets, saved.userType)) {
        setUserType(saved.userType);
        setQuestionType(
          questions.some((q) => q.key === saved.questionType)
            ? saved.questionType
            : ""
        );
      }
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  const saveChoices = (nextUser: string, nextQuestion: string) => {
    setUserType(nextUser);
    setQuestionType(nextQuestion);
    window.history.replaceState(
      {
        ...window.history.state,
        faqChoices: { userType: nextUser, questionType: nextQuestion },
      },
      ""
    );
  };
  const updateQuestion = (q: string) => saveChoices(userType, q);
  return (
    <>
      <MultiChoice
        idPrefix="user-type"
        legend="Vous êtes :"
        values={Object.entries(FAQTargets).map(([key, value]) => ({
          label: value,
          onClick: () => {
            saveChoices(key, "");
          },
          checked: userType === key,
        }))}
      />
      {userType && (
        <>
          <br />
          <MultiChoice
            idPrefix="user-question"
            legend="Vous voulez :"
            values={questions.map(({ key, label }) => ({
              label,
              onClick: () => {
                updateQuestion(key);
              },
              checked: questionType === key,
            }))}
          />
        </>
      )}

      <div aria-live="polite">
        {questionType && questionType === "company" ? (
          <ContactCompanyAnswer />
        ) : questionType === "fraud" ? (
          <FraudAnswer />
        ) : questionType === "contact" ? (
          <ContactAnswer user={user} userType={userType} />
        ) : null}
      </div>
    </>
  );
}
