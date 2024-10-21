'use client';

import { ISession } from '#models/user/session';
import { getHidePersonalDataRequestFCSession } from '#utils/session';
import { useEffect, useState } from 'react';
import { ConnectionFranceConnect } from './connection-france-connect';
import { RenseignerSiren } from './renseigner-siren';
import { RequestState } from './request-state';

type IProps = {
  session: ISession | null;
};

export default function HidePersonalDataPageClient({ session }: IProps) {
  const franceConnected = getHidePersonalDataRequestFCSession(session);
  const [formState, setFormState] = useState({
    uniteLegale: undefined,
    hidePersonalDataRequest: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  const postFormData = async (formData: FormData) => {
    setError(null);

    try {
      const response = await fetch('/api/hide-personal-data', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Une erreur inattendue est survenue.'
        );
      }

      const data = await response.json();
      setFormState(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Une erreur inattendue est survenue.');
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [formState]);

  return formState.uniteLegale ? (
    <>
      <RequestState
        hidePersonalDataRequest={formState.hidePersonalDataRequest}
      />
    </>
  ) : (
    <>
      <ConnectionFranceConnect session={session} />
      {franceConnected && (
        <>
          <h2>Renseigner le SIREN de votre entreprise</h2>
          <RenseignerSiren postFormData={postFormData} />
          {error && <p className="fr-error-text">{error}</p>}
        </>
      )}
    </>
  );
}
