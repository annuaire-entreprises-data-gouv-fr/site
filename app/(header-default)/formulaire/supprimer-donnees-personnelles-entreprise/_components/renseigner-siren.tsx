"use client";

import { useState } from "react";
import { Link } from "#components/Link";
import { Loader } from "#components-ui/loader";
import { isSiren } from "#utils/helpers";

type RenseignerSirenProps = {
  postFormData: (formData: FormData) => Promise<void>;
};

export function RenseignerSiren({ postFormData }: RenseignerSirenProps) {
  const [siren, setSiren] = useState("");
  const [loading, setLoading] = useState(false);
  const validSiren = isSiren(siren);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("siren", siren);
    await postFormData(formData);

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset
        aria-label="SIREN de l'entreprise"
        aria-labelledby="siren-1632-fieldset-messages"
        className="fr-fieldset fr-grid-row"
        id="siren-1632-fieldset"
      >
        <div className="fr-fieldset__element fr-col-lg-6 fr-col-md-8 fr-col-sm-12">
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="siren-1-input">
              Numéro de SIREN
            </label>
            <input
              aria-describedby="siren-1-messages"
              className="fr-input"
              id="siren-1-input"
              name="siren"
              onChange={(e) => setSiren(e.target.value)}
              placeholder="Exemple : 468200728"
              type="text"
              value={siren}
            />
            <div
              aria-live="assertive"
              className="fr-messages-group"
              id="siren-1-messages"
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
        <Link href="/" rel="noopener noreferrer" target="_blank">
          → Rechercher le SIREN de mon entreprise
        </Link>
      </p>
      <p className="fr-mt-6w">
        <button
          className="fr-btn fr-btn--primary fr-mr-2w"
          disabled={!validSiren || loading}
          type="submit"
        >
          Valider et envoyer la demande {loading && <Loader />}
        </button>
      </p>
    </form>
  );
}
