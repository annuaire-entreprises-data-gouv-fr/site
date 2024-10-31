import { IUniteLegale, SirenNotFoundError } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import { Exception } from '#models/exceptions';
import {
  IHidePersonalDataRequest,
  fillHidePersonalDataRequest,
} from '#models/hide-personal-data-request';
import {
  hasSirenFormat,
  isEntrepreneurIndividuelFromNatureJuridique,
} from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import extractParamsAppRouter from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import { getHidePersonalDataRequestFCSession } from '#utils/session';
import { NextResponse } from 'next/server';

export type IFormState = {
  uniteLegale?: IUniteLegale;
  hidePersonalDataRequest?: IHidePersonalDataRequest;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const siren = formData.get('siren');
    if (typeof siren !== 'string' || !hasSirenFormat(siren)) {
      return NextResponse.json(
        { message: 'Le SIREN est invalide.' },
        { status: 400 }
      );
    }

    const { isBot } = extractParamsAppRouter({});

    const uniteLegale = await getUniteLegaleFromSlug(siren, {
      isBot,
    });

    const isEI = isEntrepreneurIndividuelFromNatureJuridique(
      uniteLegale.natureJuridique
    );

    if (isEI) {
      return NextResponse.json({
        uniteLegale,
      });
    }
    const franceConnect = getHidePersonalDataRequestFCSession(
      await getSession()
    );

    if (!franceConnect) {
      return NextResponse.json(
        { error: 'La session France Connect est invalide.' },
        { status: 401 }
      );
    }

    const hidePersonalDataRequest = await fillHidePersonalDataRequest(
      siren,
      franceConnect.firstName,
      franceConnect.familyName,
      franceConnect.birthdate,
      franceConnect.sub
    );
    return NextResponse.json({
      hidePersonalDataRequest,
      uniteLegale,
    });
  } catch (error) {
    let message = '';
    if (error instanceof SirenNotFoundError) {
      message =
        "Le SIREN est valide mais l'entreprise correspondante n'a pas été trouvée.";
    } else {
      logErrorInSentry(new HidePersonalDataFailedException({ cause: error }));
    }

    return NextResponse.json(
      {
        message:
          message || 'Une erreur est intervenue. Nos équipes ont été notifiés.',
      },
      { status: message ? 400 : 500 }
    );
  }
}

class HidePersonalDataFailedException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      ...args,
      name: 'LogoutFailedException',
    });
  }
}
