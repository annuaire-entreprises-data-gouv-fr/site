import { DataStore } from '#clients/data-store';
import { InternalError } from '#models/exceptions';
import { readFromGrist } from '#utils/integrations/grist';
import logErrorInSentry from '#utils/sentry';
import {
  extractSirenFromSiret,
  Siren,
  Siret,
} from '../../utils/helpers/siren-and-siret';

/**
 * List of siren whose owner asked to be removed from website
 * See /public/protected-siren.txt
 */
class ProtectedSirenList {
  public _list: DataStore<boolean>;
  // time before protected siren list update
  private TTL = 3600000; //1000 * 60 * 60

  constructor() {
    this._list = new DataStore<boolean>(
      () => readFromGrist('protected-siren'),
      'protected-siren',
      this.mapResponseToProtectedSirenList,
      this.TTL
    );
  }

  mapResponseToProtectedSirenList = (response: { siren: string }[]) => {
    const sirenList = response
      .map((record) => record.siren)
      .filter(Boolean)
      .reduce((acc: { [key: string]: boolean }, protectedSiren) => {
        acc[protectedSiren] = true;
        return acc;
      }, {});

    if (Object.keys(sirenList).length < 4000) {
      logErrorInSentry(
        new InternalError({
          message: 'ProtectedSirenList is abnormally low',
        })
      );
    }
    return sirenList;
  };
}

const protectedSiren = new ProtectedSirenList();

export const isProtectedSiren = async (siren: Siren) =>
  protectedSiren._list.get(siren);

export const isProtectedSiret = async (siret: Siret) => {
  const siren = extractSirenFromSiret(siret);
  return protectedSiren._list.get(siren);
};

export const getProtectedSirenList = async () => protectedSiren._list.getKeys();
