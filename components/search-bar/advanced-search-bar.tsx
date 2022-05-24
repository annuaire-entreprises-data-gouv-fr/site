import React from 'react';
import ButtonLink from '../button';

const AdvancedSearchBar = () => (
  <div className="advanced-search-wrapper">
    <input
      className="toggle-advanced-search"
      id="toggle-advanced-search"
      type="checkbox"
    />
    <div className="show-advanced layout-right">
      <label
        className="button-toggle-advanced-search"
        htmlFor="toggle-advanced-search"
      >
        {`>> recherche avancée`}
      </label>
    </div>
    <div className="hide-advanced layout-right">
      <label
        className="button-toggle-advanced-search"
        htmlFor="toggle-advanced-search"
      >
        ✕ fermer la recherche avancée
      </label>
    </div>
    <div className="fields">
      <label className="fr-label" htmlFor="search-code-postal">
        Code postal
      </label>
      <input
        className="fr-input"
        type="search"
        id="search-code-postal"
        name="codePostal"
        pattern="((0[1-9])|([1-8][0-9])|(9[0-8])|(2A)|(2B))[0-9]{3}"
        autoComplete="off"
      />
      <label className="fr-label" htmlFor="search-code-naf">
        Code d’activité (<a href="">NAF</a>)
      </label>
      <input
        className="fr-input"
        type="search"
        id="search-code-naf"
        name="codeNaf"
        autoComplete="off"
      />
      <br />
      <div className="layout-right">
        <ButtonLink type="submit" small>
          <span>Lancer la recherche</span>
        </ButtonLink>
      </div>
    </div>
    <style jsx>{`
      .advanced-search-wrapper {
        background-color: #f9f9f9;
      }
      .show-advanced,
      .hide-advanced {
        font-style: italic;
        font-size: 0.9rem;
        cursor: pointer;
        text-decoration: underline;
      }
      .show-advanced {
        max-width: 450px;
      }

      .toggle-advanced-search {
        display: none;
      }

      div.fields {
        max-height: 0;
        overflow-x: hidden;
        transition: max-height 200ms ease-in-out;
      }

      .toggle-advanced-search:checked ~ .fields {
        max-height: 1000px;
      }
      .toggle-advanced-search:checked ~ .show-advanced {
        display: none;
      }
      .toggle-advanced-search:not(:checked) ~ .hide-advanced {
        display: none;
      }
    `}</style>
  </div>
);

export default AdvancedSearchBar;
