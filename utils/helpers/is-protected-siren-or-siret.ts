import { DataStore } from '#clients/data-store';
import { readFromGrist } from '#utils/integrations/grist';
import { extractSirenFromSiret, Siren, Siret } from './siren-and-siret';

/**
 * List of siren whose owner asked to be removed from website
 * See /public/protected-siren.txt
 */
class ProtectedSirenList {
  public _list: DataStore<boolean>;
  // time before protected siren list update
  private TTL = 300000; //1000 * 60 * 5

  constructor() {
    this._list = new DataStore<boolean>(
      () => readFromGrist('protected-siren'),
      'protected-siren',
      this.mapResponseToProtectedSirenList,
      this.TTL
    );
  }

  // TODO To Implement
  checkAnomalies = () => {
    // const newSirenToOldRatio = protectedSiren.length / oldProtectedSiren.length;
    // if (newSirenToOldRatio < 0.75) {
    //   throw new ProtectedSirenTooManySuppressionsError(
    //     `New list is only ${newSirenToOldRatio}% of previous list. Should not be less than 75%`
    //   );
    // }
  };

  mapResponseToProtectedSirenList = (response: { siren: string }[]) =>
    response
      .map((record) => record.siren)
      .filter(Boolean)
      .reduce((acc: { [key: string]: boolean }, protectedSiren) => {
        acc[protectedSiren] = true;
        return acc;
      }, {});
}

const protectedSiren = new ProtectedSirenList();

export const isProtectedSiren = async (siren: Siren) =>
  protectedSiren._list.get(siren);

export const isProtectedSiret = async (siret: Siret) => {
  const siren = extractSirenFromSiret(siret);
  return protectedSiren._list.get(siren);
};

export const getProtectedSirenList = async () => protectedSiren._list.getAll();
