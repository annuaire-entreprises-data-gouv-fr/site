"use client";

import { MultiChoice } from "#components-ui/multi-choice";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { useState } from "react";
import { ContactAnswer } from "./answers/contact";
import { ContactCompanyAnswer } from "./answers/contact-entreprise";
import { FraudAnswer } from "./answers/fraud";

type IProps = {
  session: ISession | null;
};

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

export default function ParcoursQuestions({ session }: IProps) {
  const [userType, setUserType] = useState(
    hasRights(session, ApplicationRights.isAgent) ? "agent" : ""
  );
  const [questionType, setQuestionType] = useState<string>("");

  const updateQuestion = (q: string) => {
    setQuestionType(q);
  };
  return (
    <>
      <MultiChoice
        idPrefix="user-type"
        values={Object.entries(FAQTargets).map(([key, value]) => {
          return {
            label: value,
            onClick: () => {
              setUserType(key);
              updateQuestion("none");
            },
            checked: userType === key,
          };
        })}
      />
      {userType && (
        <>
          <br />
          <strong>Vous voulez :</strong>
          <MultiChoice
            idPrefix="user-question"
            values={questions.map(({ key, label }) => {
              return {
                label,
                onClick: () => {
                  updateQuestion(key);
                },
                checked: questionType === key,
              };
            })}
          />
        </>
      )}

      {questionType && questionType === "company" ? (
        <ContactCompanyAnswer />
      ) : questionType === "fraud" ? (
        <FraudAnswer />
      ) : questionType === "contact" ? (
        <ContactAnswer userType={userType} session={session} />
      ) : null}
    </>
  );
}
