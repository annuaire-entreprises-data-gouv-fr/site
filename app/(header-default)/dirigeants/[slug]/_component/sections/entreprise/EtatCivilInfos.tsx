import { IEtatCivil, IEtatCivilAfterInpiIgMerge } from '#models/rne/types';
import { formatDateLong, formatDatePartial } from '#utils/helpers';

export default function EtatCivilInfos({
  dirigeant,
}: {
  dirigeant: IEtatCivil | IEtatCivilAfterInpiIgMerge;
}) {
  const nomComplet = `${dirigeant.prenom || ''}${
    dirigeant.prenom && dirigeant.nom ? ' ' : ''
  }${(dirigeant.nom || '').toUpperCase()}`;

  return (
    <>
      {nomComplet}
      {dirigeant.dateNaissance || dirigeant.dateNaissancePartial
        ? `, né(e) ${
            dirigeant.dateNaissance
              ? 'le ' + formatDateLong(dirigeant.dateNaissance)
              : 'en ' + formatDatePartial(dirigeant.dateNaissancePartial)
          }${dirigeant.lieuNaissance ? `, à ${dirigeant.lieuNaissance}` : ''}`
        : ''}
    </>
  );
}
