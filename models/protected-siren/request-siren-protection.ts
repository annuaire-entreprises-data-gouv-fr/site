import { logInGrist, readFromGrist } from '#clients/external-tooling/grist';
import { isProtectedSiren } from '#models/protected-siren';
import { verifySiren } from '#utils/helpers';

export type IHidePersonalDataRequest =
  | 'PENDING'
  | 'CREATED'
  | 'ACCEPTED'
  | 'DENIED';

export async function requestSirenProtection(
  siren: string,
  firstName: string,
  familyName: string,
  birthdate: string,
  sub: string
): Promise<IHidePersonalDataRequest> {
  const validSiren = verifySiren(siren);
  if (await isProtectedSiren(validSiren)) {
    return 'ACCEPTED';
  }
  const requests = await readFromGrist('hide-personal-data');
  const request = requests.find(
    (r) => r.siren === validSiren && r.subFranceConnect === sub
  );
  if (request && request.denied === true) {
    return 'DENIED';
  }
  if (request) {
    return 'PENDING';
  }

  await logInGrist('hide-personal-data', [
    {
      siren: validSiren,
      subFranceConnect: sub,
      denied: false,
      firstName,
      familyName,
      birthdate,
      dirigeantPage:
        'https://annuaire-entreprises.data.gouv.fr/dirigeants/' + validSiren,
      date: new Date().toISOString().slice(0, 10),
    },
  ]);
  return 'CREATED';
}
