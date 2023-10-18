import { GetServerSideProps } from 'next';
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import ButtonLink from '#components-ui/button';
import { MultiChoice } from '#components-ui/multi-choice';
import TextWrapper from '#components-ui/text-wrapper';
import { LayoutSimple } from '#components/layouts/layout-simple';
import MatomoEvent from '#components/matomo-event';
import { allData } from '#models/administrations';
import constants from '#models/constants';
import { FAQTargets, IArticle, allFaqArticlesByTarget } from '#models/faq';
import { NextPageWithLayout } from 'pages/_app';

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
  questions: IArticle[];
};

const Answer: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <>
    <p>
      <b>Réponse</b>
    </p>
    <TextWrapper>
      <div className="parcours-response">
        {children}
        <style jsx>{`
          .parcours-response {
            background: #efefef;
            padding: 30px 20px;
            margin: 10px;
            border-radius: 3px;
          }
        `}</style>
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
          <b>Je ne trouve pas la réponse à ma question</b>.
          {userType === 'independant' && (
            <p>
              Si vous possédez une <b>entreprise individuelle</b> dont vous
              souhaitez <b>cacher ou afficher</b> les informations personnelles,{' '}
              <a href="/faq/rendre-mon-entreprise-non-diffusible">
                consultez notre fiche
              </a>
              .
            </p>
          )}
          <p>
            Si vous avez une question à laquelle cette FAQ n’a pas répondu, vous
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
            <b>NB :</b> si votre question concerne une structure en particulier,
            pensez à nous indiquer le <b>siren ou le siret</b> dans le corps du
            mail.
          </p>
        </Answer>
      );
    case EQuestionType.MODIFICATION:
      return (
        <>
          <p>
            <b>
              Comment modifier les informations d’une entreprise, d’une
              association ou d’un service public ?
            </b>
          </p>
          <p>
            Si la modification concerne{' '}
            <b>l’affichage de données personnelles</b> sur le site, consultez{' '}
            <a href="/faq/supprimer-donnees-personnelles-entreprise">
              notre fiche dédiée
            </a>{' '}
            ou notre <a href="/vie-privee">politique de confidentialité</a>.
          </p>
          <p>
            Pour le reste, l’Annuaire des Entreprises centralise les
            informations dont dispose l’administration sur une entreprise, une
            association ou un service public, mais{' '}
            <b>ne stocke aucune information</b>. Les informations que vous voyez
            sur le site sont récupérées <b>en temps réel</b> auprès des services
            des administrations qui en ont la charge.
          </p>
          <p>
            Si vous constatez une erreur, il est{' '}
            <b>essentiel de la faire corriger à la source</b>, pour que la
            correction soit transmise à toute l’administration.
          </p>
          <p>
            <b>Quelle information souhaitez-vous faire modifier ?</b>
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
                “<b>{dataToModify.label}</b>”
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
            <b>Quelle est votre question ?</b>
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

const Parcours: NextPageWithLayout<{
  initialQuestionType: EQuestionType | null;
}> = ({ initialQuestionType }) => {
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
      <b>Qui êtes-vous ?</b>
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
      <div className="parcours-bottom-margin" />
      <style jsx>{`
        .parcours-bottom-margin {
          margin-top: 200px;
        }
      `}</style>
    </>
  );
};

Parcours.getLayout = function getLayout(
  page: ReactElement,
  isBrowserOutdated,
  session
) {
  return (
    <LayoutSimple isBrowserOutdated={isBrowserOutdated} session={session}>
      {page}
    </LayoutSimple>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const question = (context?.query?.question || '') as EQuestionType;

  const initialQuestionType = Object.values(EQuestionType).indexOf(question)
    ? question
    : null;

  return {
    props: { initialQuestionType, metadata: { useReact: true } },
  };
};

export default Parcours;
