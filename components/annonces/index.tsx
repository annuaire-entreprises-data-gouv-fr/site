import React from 'react';
import { EAdministration } from '../../models/administration';
import ButtonLink from '../button';
import { Section } from '../section';

const Annonces: React.FC<{
  siren: string;
}> = ({ siren }) => (
  <>
    <Section title="Annonces BODACC" source={EAdministration.DILA}>
      <div className="annonces">
        <div>
          Vous pouvez consulter les annonces publiées par cette entreprise au
          bulletin officiel
        </div>
        <ButtonLink
          alt
          target="_blank"
          href={`https://www.bodacc.fr/annonce/liste/${siren}`}
        >
          ⇢ Voir les annonces (BODACC)
        </ButtonLink>
      </div>
    </Section>
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
