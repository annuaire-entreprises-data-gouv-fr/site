import { useState } from "react";
import { MultiChoice } from "#/components-ui/multi-choice";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { ContactAnswer } from "./answers/contact";
import { ContactCompanyAnswer } from "./answers/contact-entreprise";
import { FraudAnswer } from "./answers/fraud";

export const FAQTargets = {
  particulier: "Particulier",
  entreprise: "Entreprise ou auto-entreprise",
  association: "Association",
  agent: "Agent public",
  none: "Autre",
} as const;
export type FAQTarget = keyof typeof FAQTargets;

export const FAQQuestions = {
  company: "Joindre une entreprise",
  fraud: "Nous alerter d’une fraude ou tentative d’escroquerie",
  contact: "Autre",
} as const;
export type FAQQuestion = keyof typeof FAQQuestions;

interface IProps {
  initialQuestionType?: FAQQuestion;
  initialUserType?: FAQTarget;
  user: IAgentInfo | null;
}

export default function ParcoursQuestions({
  user,
  initialUserType,
  initialQuestionType,
}: IProps) {
  const [userType, setUserType] = useState(
    initialUserType ||
      (hasRights({ user }, ApplicationRights.isAgent) ? "agent" : "")
  );
  const [questionType, setQuestionType] = useState(initialQuestionType || "");

  const updateQuestion = (q: string) => {
    setQuestionType(q);
  };
  return (
    <>
      <MultiChoice
        idPrefix="user-type"
        values={Object.entries(FAQTargets).map(([key, value]) => ({
          label: value,
          onClick: () => {
            setUserType(key);
            updateQuestion("none");
          },
          checked: userType === key,
        }))}
      />
      {userType && (
        <>
          <br />
          <strong>Vous voulez :</strong>
          <MultiChoice
            idPrefix="user-question"
            values={Object.entries(FAQQuestions).map(([key, label]) => ({
              label,
              onClick: () => {
                updateQuestion(key);
              },
              checked: questionType === key,
            }))}
          />
        </>
      )}

      {questionType && questionType === "company" ? (
        <ContactCompanyAnswer />
      ) : questionType === "fraud" ? (
        <FraudAnswer />
      ) : questionType === "contact" ? (
        <ContactAnswer user={user} userType={userType} />
      ) : null}
    </>
  );
}
