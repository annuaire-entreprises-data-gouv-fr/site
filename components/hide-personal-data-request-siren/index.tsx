import { useState } from 'react';
import { isSiren } from '#utils/helpers';
import { getHidePersonalDataRequestFCSession } from '#utils/session';
import useSession from 'hooks/use-session';

export function RenseignerSiren() {
  const [siren, setSiren] = useState<string>('');
  let validSiren = isSiren(siren);
  const session = useSession();
  const isConnected = session && !!getHidePersonalDataRequestFCSession(session);
  return (
    <form method="POST">
      <fieldset
        className="fr-fieldset fr-grid-row"
        aria-label="SIREN de l'entreprise"
        id="siren-1632-fieldset"
        aria-labelledby="siren-1632-fieldset-messages"
      >
        <div className="fr-fieldset__element fr-col-lg-6 fr-col-md-8 fr-col-sm-12">
          <div className="fr-input-group">
            <label htmlFor="siren-1-input" className="fr-label">
              Numéro de SIREN
            </label>
            <input
              className="fr-input"
              placeholder="Exemple : 468200728"
              aria-describedby="siren-1-messages"
              name="siren"
              value={siren}
              onChange={(e) => setSiren(e.target.value)}
              type="text"
              id="siren-1-input"
            />
            <div
              className="fr-messages-group"
              id="siren-1-messages"
              aria-live="assertive"
            >
              {siren && !validSiren && (
                <p className="fr-error-text">
                  Le numéro renseigné n’est pas un SIREN valide
                </p>
              )}
            </div>
          </div>
        </div>
      </fieldset>
      <p>
        <a href="/" target="_blank" rel="noopener noreferrer">
          → Rechercher le SIREN de mon entreprise
        </a>
      </p>
      <p role="list" className="fr-mt-6w">
        <button
          role="listitem"
          className="fr-btn fr-btn--primary fr-mr-2w"
          type="submit"
          disabled={!validSiren || !isConnected}
        >
          Valider et envoyer la demande
        </button>
      </p>
    </form>
  );
}
