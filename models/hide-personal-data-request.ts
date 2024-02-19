import { verifySiren } from '#utils/helpers';
import { isProtectedSiren } from '#utils/helpers/is-protected-siren-or-siret';
import { logInGrist, readFromGrist } from '#utils/integrations/grist';

export type IHidePersonalDataRequest =
  | 'PENDING'
  | 'CREATED'
  | 'ACCEPTED'
  | 'DENIED';

export async function fillHidePersonalDataRequest(
  siren: string,
  firstName: string,
  familyName: string,
  birthdate: string,
  sub: string
): Promise<IHidePersonalDataRequest> {
  const validSiren = verifySiren(siren);
  if (isProtectedSiren(validSiren)) {
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
