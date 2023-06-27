import { GetServerSideProps } from 'next';
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import ButtonLink from '#components-ui/button';
import { Loader } from '#components-ui/loader';
import { MultiChoice } from '#components-ui/multi-choice';
import TextWrapper from '#components-ui/text-wrapper';
import { LayoutSimple } from '#components/layouts/layout-simple';
import { allDataKeyword } from '#models/administrations';
import constants from '#models/constants';
import { allFaqArticlesByTarget, faqTargets, IArticle } from '#models/faq';
import { NextPageWithLayout } from 'pages/_app';

const enum QuestionType {
  LOADER = 'loader',
  NONE = 'none',
  MODIFICATION = 'modification',
  CONTACT = 'contact',
  ALL = 'all',
}

type IProps = {
  questionType: QuestionType;
  setQuestionType: (type: QuestionType) => void;
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
  const [modifyKeyword, selectModifyKeyword] = useState<any>('');

  useEffect(() => {
    selectModifyKeyword('');
  }, [questionType]);

  switch (questionType) {
    case QuestionType.LOADER:
      return (
        <div className="layout-center" style={{ height: '200px' }}>
          <Loader />
        </div>
      );
    case QuestionType.CONTACT:
      return (
        <Answer>
          Vous avez sélectionné{' '}
          <b>“je ne trouve pas la réponse à ma question”</b>.
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
          {userType === 'dirigeant' ? (
            <p>
              Si vous êtes dirigeant(e) d’une société et que vous souhaitez{' '}
              <b>cacher ou afficher</b> vos informations personnelles, ou si
              vous avez une autre question à laquelle cette FAQ n’a pas répondu,
              vous pouvez nous contacter :
            </p>
          ) : (
            <p>
              Si vous avez une autre question à laquelle cette FAQ n’a pas
              répondu, vous pouvez nous contacter :
            </p>
          )}
          <div className="layout-center">
            <ButtonLink to={constants.links.mailto}>
              Écrivez-nous à {constants.links.mail}
            </ButtonLink>
          </div>
          <p>
            <b>NB :</b> si votre question concerne une structure en particulier,
            pensez à nous indiquer le siren ou le siret dans le corps du mail.
          </p>
        </Answer>
      );
    case QuestionType.MODIFICATION:
      return (
        <>
          <p>
            <b>
              Comment modifier les informations d’une entreprise, d’une
              association ou d’un service public ?
            </b>
          </p>
          <p>
            Si la modification concerne <b>l’affichage de donnée personnelle</b>{' '}
            sur le site, consultez{' '}
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
            values={allDataKeyword.map((dataKeyword) => {
              return {
                onClick: () => selectModifyKeyword(dataKeyword),
                checked: dataKeyword.label === modifyKeyword.label,
                label: dataKeyword.label,
              };
            })}
          />
          {modifyKeyword && (
            <Answer>
              Comment modifier les informations suivantes ?
              <p>
                “<b>{modifyKeyword.label}</b>”
              </p>
              <p>Ces informations proviennent de :</p>
              <ul>
                <li>
                  Source de la donnée :{' '}
                  <a href={modifyKeyword.datagouvLink}>
                    {modifyKeyword.dataSource}
                  </a>
                </li>
                <li>
                  Service responsable :{' '}
                  <a href={modifyKeyword.site}>{modifyKeyword.long}</a>.
                </li>
              </ul>
              {modifyKeyword.contact && (
                <>
                  <br />
                  <div className="layout-center">
                    <ButtonLink to={modifyKeyword.contact}>
                      Contacter le service ({modifyKeyword.short})
                    </ButtonLink>
                  </div>
                </>
              )}
            </Answer>
          )}
        </>
      );
    case QuestionType.ALL:
    default:
      return (
        <>
          <p>
            <b>Quelle est votre question ?</b>
          </p>
          <MultiChoice
            idPrefix="question-type"
            values={[
              {
                onClick: () => setQuestionType(QuestionType.MODIFICATION),
                label:
                  'Comment modifier les informations d’une entreprise, d’une association ou d’un service public ?',
              },
              ...questions.map(({ title, slug }) => {
                return {
                  href: `/faq/${slug}`,
                  //@ts-ignore
                  label: title,
                };
              }),
              {
                onClick: () => setQuestionType(QuestionType.CONTACT),
                label: 'Je ne trouve pas la réponse à ma question',
              },
            ]}
          />
          <br />
        </>
      );
  }
};

const Parcours: NextPageWithLayout<{}> = () => {
  const scrollRef = useRef(null);

  const [userType, setUserType] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>(
    QuestionType.NONE
  );

  const scroll = () => {
    if (scrollRef && scrollRef.current) {
      //@ts-ignore
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const updateQuestion = (q: QuestionType) => {
    setQuestionType(QuestionType.LOADER);
    scroll();
    setTimeout(() => setQuestionType(q), 400);
  };

  return (
    <>
      <h1 ref={scrollRef}>Bonjour, comment pouvons-nous vous aider ?</h1>

      <p>Pour commencer, faisons connaissance :</p>
      <b>Qui êtes-vous ?</b>
      <MultiChoice
        idPrefix="user-type"
        values={Object.keys(faqTargets).map((key) => {
          return {
            //@ts-ignore
            label: faqTargets[key],
            onClick: () => {
              setUserType(key);
              updateQuestion(QuestionType.NONE);
            },
            checked: userType === key,
          };
        })}
      />
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

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      metadata: { useReact: true },
    },
  };
};

export default Parcours;
