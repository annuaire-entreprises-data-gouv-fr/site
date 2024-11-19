import { IEtatCivil, IEtatCivilAfterInpiIgMerge } from '#models/rne/types';
import { Siren } from '#utils/helpers';

export const SeePersonPageLink = ({
  person,
  label,
  sirenFrom,
}: {
  person: IEtatCivil | IEtatCivilAfterInpiIgMerge;
  label?: string;
  sirenFrom?: Siren;
}) => (
  <a
    href={`/personne?n=${person.nom}&fn=${
      person.prenoms || person.prenom
    }&partialDate=${person.dateNaissancePartial}${
      sirenFrom ? `&sirenFrom=${sirenFrom}` : ''
    }`}
  >
    {label || '→ voir ses entreprises'}
  </a>
);
