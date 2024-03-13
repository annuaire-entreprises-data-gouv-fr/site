'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader } from '#components-ui/loader';
import { isSiren } from '#utils/helpers';

type IProps = {
  formAction: (formData: FormData) => void;
};

export function RenseignerSiren({ formAction }: IProps) {
  const [siren, setSiren] = useState<string>('');
  let validSiren = isSiren(siren);

  return (
    <form action={formAction}>
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
      <SubmitButton disabled={!validSiren} />
    </form>
  );
}

export function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <p className="fr-mt-6w">
      <button
        className="fr-btn fr-btn--primary fr-mr-2w"
        type="submit"
        disabled={disabled || pending}
      >
        Valider et envoyer la demande {pending && <Loader />}
      </button>
    </p>
  );
}
