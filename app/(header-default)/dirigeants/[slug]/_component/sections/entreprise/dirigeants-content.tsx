import FAQLink from '#components-ui/faq-link';
import { SeePersonPageLink } from '#components-ui/see-personn-page-link';
import { FullTable } from '#components/table/full';
import { IUniteLegale } from '#models/core/types';
import {
  IDirigeantsWithMetadata,
  IEtatCivil,
  IPersonneMorale,
} from '#models/rne/types';
import { formatDateLong, formatDatePartial, formatIntFr } from '#utils/helpers';
import { isPersonneMorale } from '../is-personne-morale';

type IDirigeantContentProps = {
  dirigeants: IDirigeantsWithMetadata;
  uniteLegale: IUniteLegale;
};

const DisambiguationTooltip = ({
  dataType,
  isInIg,
  isInInpi,
}: {
  dataType: string;
  isInIg?: boolean;
  isInInpi?: boolean;
}) => {
  if (!isInIg && !isInInpi) {
    return null;
  }

  return (
    <>
      <br />
      {'('}
      {!isInIg && (
        <FAQLink tooltipLabel="incohérence possible">
          Ce {dataType} n‘apparait pas dans les données d‘Infogreffe.
        </FAQLink>
      )}
      {!isInInpi && (
        <FAQLink tooltipLabel="incohérence possible">
          Ce {dataType} n‘apparait pas dans les données de l‘INPI.
        </FAQLink>
      )}
      {')'}
    </>
  );
};

export default function DirigeantsContent({
  dirigeants,
  uniteLegale,
}: IDirigeantContentProps) {
  const formatDirigeant = (dirigeant: IEtatCivil | IPersonneMorale) => {
    if (isPersonneMorale(dirigeant)) {
      const infos = [
        dirigeant.roles?.map((role) => (
          <>
            <span>{role.label}</span>
            <DisambiguationTooltip
              dataType="rôle"
              isInIg={role.isInIg}
              isInInpi={role.isInInpi}
            />
          </>
        )) || <>{dirigeant.role}</>,
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
          <DisambiguationTooltip
            dataType="dirigeant"
            isInIg={dirigeant.isInIg}
            isInInpi={dirigeant.isInInpi}
          />
        </>,
      ];

      if (dirigeant.siren) {
        const defaultDenom = dirigeant.denomination || dirigeant.siren;
        infos.push(
          <a key={dirigeant.siren} href={`/dirigeants/${dirigeant.siren}`}>
            → voir les dirigeants de {defaultDenom}
          </a>
        );
      }
      return infos;
    } else {
      const nomComplet = `${dirigeant.prenom || ''}${
        dirigeant.prenom && dirigeant.nom ? ' ' : ''
      }${(dirigeant.nom || '').toUpperCase()}`;

      return [
        dirigeant.roles?.map((role) => (
          <>
            <span>{role.label}</span>
            <DisambiguationTooltip
              dataType="rôle"
              isInIg={role.isInIg}
              isInInpi={role.isInInpi}
            />
          </>
        )) || <>{dirigeant.role}</>,
        <>
          {nomComplet}
          {dirigeant.dateNaissance || dirigeant.dateNaissancePartial
            ? `, né(e) ${
                dirigeant.dateNaissance
                  ? 'le ' + formatDateLong(dirigeant.dateNaissance)
                  : 'en ' + formatDatePartial(dirigeant.dateNaissancePartial)
              }${
                dirigeant.lieuNaissance ? `, à ${dirigeant.lieuNaissance}` : ''
              }`
            : ''}
          <DisambiguationTooltip
            dataType="dirigeant"
            isInIg={dirigeant.isInIg}
            isInInpi={dirigeant.isInInpi}
          />
        </>,
        ...(dirigeant.dateNaissancePartial
          ? [
              <SeePersonPageLink
                person={dirigeant}
                sirenFrom={uniteLegale.siren}
              />,
            ]
          : []),
      ];
    }
  };

  return (
    <>
      <FullTable
        head={['Role', 'Details', 'Action']}
        body={dirigeants.data.map((dirigeant) => formatDirigeant(dirigeant))}
      />
    </>
  );
}
