'use client';

import { Loader } from '#components-ui/loader';
import { isSiren } from '#utils/helpers';
import { useState } from 'react';

type RenseignerSirenProps = {
  postFormData: (formData: FormData) => Promise<void>;
};

export function RenseignerSiren({ postFormData }: RenseignerSirenProps) {
  const [siren, setSiren] = useState('');
  const [loading, setLoading] = useState(false);
  const validSiren = isSiren(siren);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('siren', siren);
    await postFormData(formData);

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <p className="fr-mt-6w">
        <button
          className="fr-btn fr-btn--primary fr-mr-2w"
          type="submit"
          disabled={!validSiren || loading}
        >
          Valider et envoyer la demande {loading && <Loader />}
        </button>
      </p>
    </form>
  );
}
