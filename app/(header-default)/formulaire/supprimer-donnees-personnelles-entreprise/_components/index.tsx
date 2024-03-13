'use client';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { ISession, getHidePersonalDataRequestFCSession } from '#utils/session';
import { postHidePersonalDataRequest } from '../actions';
import { ConnectionFranceConnect } from './connection-france-connect';
import { RenseignerSiren } from './renseigner-siren';
import { RequestState } from './request-state';

type IProps = {
  session: ISession;
};

export default function HidePersonalDataPageClient({ session }: IProps) {
  const franceConnected = getHidePersonalDataRequestFCSession(session);
  const [formState, formAction] = useFormState(postHidePersonalDataRequest, {});
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
          <RenseignerSiren formAction={formAction} />
        </>
      )}
    </>
  );
}
