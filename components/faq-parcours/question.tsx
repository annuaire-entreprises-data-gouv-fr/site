import { MultiChoice } from '#components-ui/multi-choice';
import TextWrapper from '#components-ui/text-wrapper';
import { allDataToModify } from '#models/administrations/data-to-modify';
import { IFaqArticle } from '#models/article/faq';
import { getAgentEmail, getAgentFullName } from '#models/user/helpers';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
export enum EQuestionType {
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
  session: ISession | null;
};

export default function Question({
  questionType,
  setQuestionType,
  userType,
  questions = [],
  session,
}: IProps) {
  const bottomRef = useRef(null);
  const email = getAgentEmail(session);
  const name = getAgentFullName(session);

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
            pouvez nous contacter via le formulaire ci-dessous :
          </p>
          <div className="layout-center">
            {/*
            Custom JS and CSS has been added to this Crisp form.
            It can be found at this address :
            https://app.crisp.chat/website/064fca1b-bdd6-4a81-af56-9f38e40953ad/plugins/settings/b68ffdd2-ba6e-46a6-94bb-d0a9872ce09a/
            */}
            <iframe
              title="Contact Form"
              src={`https://plugins.crisp.chat/urn:crisp.im:contact-form:0/contact/064fca1b-bdd6-4a81-af56-9f38e40953ad?type=${userType}${
                email ? `&email=${email}` : ''
              }${name ? `&name=${name}` : ''}`}
              referrerPolicy="origin"
              sandbox="allow-forms allow-popups allow-scripts allow-same-origin"
              width="100%"
              height="600px"
              frameBorder="0"
            ></iframe>
          </div>
          <p>
            <strong>NB :</strong> si votre question concerne une structure en
            particulier, pensez à mentionner le{' '}
            <strong>siren ou le siret</strong> dans votre message.
          </p>
          {hasRights(session, ApplicationRights.isAgent) && (
            <p>
              Rejoignez notre salon{' '}
              <a
                href="https://tchap.gouv.fr/#/room/#annuaire-entreprises:agent.dinum.tchap.gouv.fr"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tchap
              </a>{' '}
              pour nous contacter ou être tenu au courant de nos nouveautés.
            </p>
          )}
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
            values={allDataToModify
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
                  href: `/faq/modifier/${data.slug}`,
                  label: data.label,
                };
              })}
          />
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
}

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
