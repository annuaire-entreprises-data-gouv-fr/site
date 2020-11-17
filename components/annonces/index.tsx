import React from 'react';
import ButtonLink from '../button';
import HorizontalSeparator from '../horizontalSeparator';
import { Section } from '../section';

const Annonces: React.FC<{
  siren: string;
}> = ({ siren }) => (
  <>
    <Section title="Annonces BODACC">
      <div className="annonces">
        <div>
          Vous pouvez consulter les annonces publiées par cette entreprise au
          bulletin officiel
        </div>
        <ButtonLink alt href={`https://www.bodacc.fr/annonce/liste/${siren}`}>
          ⇢ Voir les annonces (BODACC)
        </ButtonLink>
      </div>
    </Section>
    <HorizontalSeparator />
    <style jsx>{`
      .annonces {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      @media only screen and (min-width: 1px) and (max-width: 900px) {
        .annonces {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }
        .annonces > div {
          width: 100%;
          margin-bottom: 10px;
        }
      }
    `}</style>
  </>
);
export default Annonces;
