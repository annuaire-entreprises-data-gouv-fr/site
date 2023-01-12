import React from 'react';
import IsActiveTag from '#components-ui/is-active-tag';
import { Tag } from '#components-ui/tag';
import { isPersonneMorale } from '#components/dirigeants-section/rncs-dirigeants';
import { SearchFeedback } from '#components/search-feedback';
import UniteLegaleBadge from '#components/unite-legale-badge';
import { estActif, IETATADMINSTRATIF } from '#models/etat-administratif';
import { IDirigeant } from '#models/immatriculation/rncs';
import { isCollectiviteTerritoriale } from '#models/index';
import { ISearchResult } from '#models/search';

interface IProps {
  results: ISearchResult[];
  withFeedback?: boolean;
  searchTerm?: string;
}

const DirigeantsOrElusList: React.FC<{ dirigeantsOrElus: IDirigeant[] }> = ({
  dirigeantsOrElus,
}) => {
  const displayMax = 5;
  const firstFive = dirigeantsOrElus.slice(0, displayMax);
  const moreCount = Math.max(dirigeantsOrElus.length - displayMax, 0);

  if (dirigeantsOrElus.length === 0) {
    return null;
  }

  return (
    <div className="dirigeants-or-elus">
      {firstFive
        .map((dirigeantOrElu) =>
          isPersonneMorale(dirigeantOrElu)
            ? `${dirigeantOrElu.denomination}`
            : `${dirigeantOrElu.prenom} ${dirigeantOrElu.nom}`
        )
        .join(', ')}
      {moreCount > 0 && `, et ${moreCount} autre${moreCount === 1 ? '' : 's'}`}
      <style jsx>{`
        .dirigeants-or-elus {
          font-size: 0.9rem;
          color: #555;
          margin: 8px auto 0;
        }
      `}</style>
    </div>
  );
};

const ResultsList: React.FC<IProps> = ({
  results,
  withFeedback = false,
  searchTerm = '',
}) => (
  <>
    {withFeedback && <SearchFeedback searchTerm={searchTerm} />}
    <div className="results-list">
      {results.map((result) => (
        <div>
          <a
            href={`/entreprise/${result.chemin}`}
            key={result.siren}
            className="result-link no-style-link"
            data-siren={result.siren}
          >
            <div className="title">
              <span>{`${result.nomComplet}`}</span>
              <UniteLegaleBadge uniteLegale={result} small hiddenByDefault />
              {!estActif(result) && (
                <IsActiveTag
                  etatAdministratif={IETATADMINSTRATIF.CESSEE}
                  statutDiffusion={result.statutDiffusion}
                />
              )}
            </div>
            <div>{result.libelleActivitePrincipale}</div>
            <DirigeantsOrElusList
              dirigeantsOrElus={
                isCollectiviteTerritoriale(result)
                  ? result.colter.elus
                  : result.dirigeants
              }
            />
            <div>
              <span className="adress">
                {result.siege.adresse || 'Adresse inconnue'}{' '}
              </span>
              <b className="etablissement-count">
                ・{result.nombreEtablissementsOuverts || 'aucun'} établissement
                {result.nombreEtablissementsOuverts > 1 ? 's' : ''} en activité
              </b>
            </div>
          </a>
          {result.matchingEtablissements.length > 0 && (
            <ul className="matching-etablissement">
              {result.matchingEtablissements.map((etablissement, index) => (
                <li>
                  <a href={`/etablissement/${etablissement.siret}`}>
                    <span className="adress">
                      {etablissement.adressePostale}
                    </span>
                    {index + 1 !== result.matchingEtablissements.length && (
                      <span className="down" />
                    )}
                  </a>
                  {!estActif(etablissement) && (
                    <IsActiveTag
                      etatAdministratif={etablissement.etatAdministratif}
                      statutDiffusion={etablissement.statutDiffusion}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
    <style jsx>{`
      .results-list > div {
        margin: 30px 0;
      }
      .results-list > div > a {
        text-decoration: none;
        border: none;
        color: #333;
        display: block;
        font-size: 1rem;
      }
      .results-list > div > a .title {
        color: #000091;
        text-decoration: none;
        font-size: 1.1rem;
        margin-bottom: 3px;

        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }

      .results-list > div > a .title > span:first-of-type {
        margin-right: 10px;
      }
      .results-list > div > a:hover .title > span:first-of-type {
        text-decoration: underline;
      }

      .results-list ul.matching-etablissement {
        margin-left: 30px;
        margin-top: 10px;
      }

      .results-list ul.matching-etablissement li {
        list-style-type: none;
        padding-left: 15px;
        position: relative;
      }
      .results-list ul.matching-etablissement li:before,
      .results-list ul.matching-etablissement .down {
        content: '';
        width: 10px;
        height: 15px;
        border: 1px solid #000091;
        border-top: none;
        border-right: none;
        position: absolute;
        left: 0;
        top: 0;
      }
      .results-list ul.matching-etablissement .down {
        border-bottom: none;
        height: 28px;
      }

      .results-list span.adress {
        color: #707070;
        font-variant: all-small-caps;
      }
      .results-list b.etablissement-count {
        color: #666;
      }
    `}</style>
  </>
);

export default ResultsList;
