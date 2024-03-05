'use client';
import { useSearchParams } from 'next/navigation';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import ButtonLink from '#components-ui/button';
import { MultiChoice } from '#components-ui/multi-choice';
import TextWrapper from '#components-ui/text-wrapper';
import MatomoEvent from '#components/matomo-event';
import { allData } from '#models/administrations';
import {
  FAQTargets,
  IFaqArticle,
  allFaqArticlesByTarget,
} from '#models/article/faq';
import constants from '#models/constants';

enum EQuestionType {
  LOADER = 'loader',
  NONE = 'none',
  MODIFICATION = 'modification',
  CONTACT = 'contact',
  ALL = 'all',
}

type IProps = {
  questionType: EQuestionType;
  setQuestionType: (type: EQuestionType) => void;
  userType: string;
  questions: IFaqArticle[];
};

const Answer: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <>
    <p>
      <strong>Réponse</strong>
    </p>
    <TextWrapper>
      <div
        style={{
          background: '#efefef',
          padding: '30px 20px',
          margin: '10px',
          borderRadius: '3px',
        }}
      >
        {children}
      </div>
    </TextWrapper>
  </>
);

const Question: React.FC<IProps> = ({
  questionType,
  setQuestionType,
  userType,
  questions = [],
}) => {
  const bottomRef = useRef(null);

  const [dataToModify, selectDataToModify] = useState<any>('');

  useEffect(() => {
    selectDataToModify('');
  }, [questionType]);

  useEffect(() => {
    if (bottomRef && bottomRef.current) {
      //@ts-ignore
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dataToModify]);

  switch (questionType) {
    case EQuestionType.CONTACT:
      return (
        <Answer>
          <strong>Je ne trouve pas la réponse à ma question</strong>.
          {userType === 'independant' && (
            <p>
              Si vous possédez une <strong>entreprise individuelle</strong> dont
              vous souhaitez <strong>cacher ou afficher</strong> les
              informations personnelles,{' '}
              <a href="/faq/rendre-mon-entreprise-non-diffusible">
                consultez notre fiche
              </a>
              .
            </p>
          )}
          <p>
            Si vous avez une question{' '}
            <strong>à propos des informations affichées sur le site</strong>, ou
            un problème lié au <strong>fonctionnement du site</strong>, vous
            pouvez nous contacter :
          </p>
          <div className="layout-center">
            <ButtonLink
              to={`${constants.links.mailto}?subject=%5B${userType}%5D%20Je%20ne%20trouve%20pas%20la%20r%C3%A9ponse%20a%20ma%20question&body=Bonjour%2C%20%0A%0AVoici%20ma%20question%20%3A%0AVoici%20le%20num%C3%A9ro%20Siren%20%2F%20Siret%20concern%C3%A9%20%3A`}
            >
              Écrivez-nous à {constants.links.mail}
            </ButtonLink>
          </div>
          <p>
            <strong>NB :</strong> si votre question concerne une structure en
            particulier, pensez à nous indiquer le{' '}
            <strong>siren ou le siret</strong> dans le corps du mail.
          </p>
        </Answer>
      );
    case EQuestionType.MODIFICATION:
      return (
        <>
          <p>
            <strong>
              Comment modifier les informations d’une entreprise, d’une
              association ou d’un service public ?
            </strong>
          </p>
          <p>
            Si la modification concerne{' '}
            <strong>l’affichage de données personnelles</strong> sur le site,
            consultez{' '}
            <a href="/faq/supprimer-donnees-personnelles-entreprise">
              notre fiche dédiée
            </a>{' '}
            ou notre <a href="/vie-privee">politique de confidentialité</a>.
          </p>
          <p>
            Pour le reste, l’Annuaire des Entreprises centralise les
            informations dont dispose l’administration sur une entreprise, une
            association ou un service public, mais{' '}
            <strong>ne stocke aucune information</strong>. Les informations que
            vous voyez sur le site sont récupérées{' '}
            <strong>en temps réel</strong> auprès des services des
            administrations qui en ont la charge.
          </p>
          <p>
            Si vous constatez une erreur, il est{' '}
            <strong>essentiel de la faire corriger à la source</strong>, pour
            que la correction soit transmise à toute l’administration.
          </p>
          <p>
            <strong>Quelle information souhaitez-vous faire modifier ?</strong>
          </p>
          <MultiChoice
            idPrefix="modification"
            values={allData
              .filter((data) => {
                if (userType === 'agent' || userType === 'all') {
                  return true;
                } else {
                  return (
                    data.targets.length === 0 ||
                    data.targets.indexOf(userType) > -1
                  );
                }
              })
              .map((data) => {
                return {
                  onClick: () => selectDataToModify(data),
                  checked: data.label === dataToModify.label,
                  label: data.label,
                };
              })}
          />
          {dataToModify && (
            <Answer>
              <span ref={bottomRef} />
              <MatomoEvent
                category="parcours:modification"
                action={userType}
                name={dataToModify.label}
              />
              Comment modifier les informations suivantes ?
              <p>
                “<strong>{dataToModify.label}</strong>”
              </p>
              <p>Ces informations proviennent de :</p>
              <ul>
                <li>
                  Source de la donnée :{' '}
                  <a href={dataToModify.datagouvLink}>
                    {dataToModify.dataSource}
                  </a>
                </li>
                <li>
                  Service responsable :{' '}
                  <a href={dataToModify.site}>{dataToModify.long}</a>.
                </li>
              </ul>
              {dataToModify.form ? (
                <>
                  <p>
                    Cette administration propose une démarche en ligne&nbsp;:
                  </p>
                  <div className="layout-center">
                    <ButtonLink to={dataToModify.form}>
                      Accéder à la démarche en ligne
                    </ButtonLink>
                  </div>
                </>
              ) : (
                <>
                  <br />
                  <div className="layout-center">
                    <ButtonLink to={dataToModify.contact}>
                      Contacter le service ({dataToModify.short})
                    </ButtonLink>
                  </div>
                </>
              )}
            </Answer>
          )}
        </>
      );
    case EQuestionType.ALL:
    default:
      let modifyText = ' d’une entreprise, association ou service public';

      if (userType === 'entreprise' || userType === 'independant') {
        modifyText = ' de mon entreprise';
      }

      if (userType === 'association') {
        modifyText = ' de mon association';
      }
      return (
        <>
          <p>
            <strong>Quelle est votre question ?</strong>
          </p>
          <MultiChoice
            idPrefix="question-type"
            values={[
              {
                onClick: () => setQuestionType(EQuestionType.MODIFICATION),
                label: `Comment modifier les informations ${modifyText} ?`,
              },
              ...questions.map(({ title, slug }) => {
                return {
                  href: `/faq/${slug}`,
                  //@ts-ignore
                  label: title,
                };
              }),
              {
                onClick: () => setQuestionType(EQuestionType.CONTACT),
                label: 'Je ne trouve pas la réponse à ma question',
              },
            ]}
          />
          <br />
        </>
      );
  }
};

export default function Parcours() {
  const question = (useSearchParams()?.get('question') ?? '') as EQuestionType;

  const initialQuestionType = Object.values(EQuestionType).indexOf(question)
    ? question
    : null;

  const scrollRef = useRef(null);

  const [userType, setUserType] = useState(initialQuestionType ? 'all' : '');
  const [questionType, setQuestionType] = useState<EQuestionType>(
    initialQuestionType || EQuestionType.NONE
  );

  const scroll = () => {
    if (scrollRef && scrollRef.current) {
      //@ts-ignore
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const updateQuestion = (q: EQuestionType) => {
    setQuestionType(q);
    scroll();
  };

  return (
    <>
      <h1>Bonjour, comment pouvons-nous vous aider ?</h1>
      <p>Pour commencer, faisons connaissance :</p>
      <strong>Qui êtes-vous ?</strong>
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
      <div style={{ marginTop: '200px' }} />
    </>
  );
}
