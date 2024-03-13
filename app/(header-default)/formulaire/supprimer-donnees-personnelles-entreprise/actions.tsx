'use server';
import { IUniteLegale } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import { InternalError } from '#models/exceptions';
import {
  IHidePersonalDataRequest,
  fillHidePersonalDataRequest,
} from '#models/hide-personal-data-request';
import { isEntrepreneurIndividuelFromNatureJuridique } from '#utils/helpers';
import extractParamsAppRouter from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import { getHidePersonalDataRequestFCSession } from '#utils/session';

export type IFormState = {
  uniteLegale?: IUniteLegale;
  hidePersonalDataRequest?: IHidePersonalDataRequest;
};

export async function postHidePersonalDataRequest(
  _: IFormState,
  formData: FormData
): Promise<IFormState> {
  const siren = formData.get('siren');
  if (!siren || typeof siren !== 'string') {
    throw new InternalError({
      message: 'SIREN is missing or wrong format',
    });
  }

  const { isBot } = extractParamsAppRouter({});

  const uniteLegale = await getUniteLegaleFromSlug(siren, {
    isBot,
  });

  const isEI = isEntrepreneurIndividuelFromNatureJuridique(
    uniteLegale.natureJuridique
  );

  if (isEI) {
    return {
      uniteLegale,
    };
  }
  const franceConnect = getHidePersonalDataRequestFCSession(await getSession());

  if (!franceConnect) {
    throw new InternalError({
      message: 'FranceConnect session is not valid',
    });
  }

  const hidePersonalDataRequest = await fillHidePersonalDataRequest(
    siren,
    franceConnect.firstName,
    franceConnect.familyName,
    franceConnect.birthdate,
    franceConnect.sub
  );
  return {
    hidePersonalDataRequest,
    uniteLegale,
  };
}
