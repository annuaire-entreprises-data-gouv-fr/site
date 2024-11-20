import { IPersonneMorale } from '#models/rne/types';
import { formatIntFr } from '#utils/helpers';

export default function PersonneMoraleInfos({
  dirigeant,
}: {
  dirigeant: IPersonneMorale;
}) {
  return (
    <>
      <strong>{dirigeant.denomination}</strong>
      {dirigeant.siren ? (
        <>
          {' - '}
          <a href={`/entreprise/${dirigeant.siren}`}>
            {formatIntFr(dirigeant.siren)}
          </a>
        </>
      ) : (
        ''
      )}
      {dirigeant.natureJuridique && (
        <>
          <br />
          {dirigeant.natureJuridique}
        </>
      )}
    </>
  );
}
