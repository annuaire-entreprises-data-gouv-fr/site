import React from 'react';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import { ProtectedSection } from '#components/section/protected-section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import {
  IConformite,
  IDonneesRestreinteUniteLegale,
} from '#models/espace-agent/donnees-restreintes-entreprise';
import { IUniteLegale } from '#models/index';
import { NextPageWithLayout } from 'pages/_app';

const Conformite: React.FC<{
  data: IConformite | IAPINotRespondingError;
}> = ({ data }) => {
  return isAPINotResponding(data) ? (
    data.errorType === 404 ? (
      <i>Introuvable</i>
    ) : (
      <i>Ce téléservice est actuellement indisponible</i>
    )
  ) : (
    <div className="layout-space-between">
      {typeof data.isValid === 'boolean' ? (
        data.isValid ? (
          <Icon slug="open">conforme</Icon>
        ) : (
          <Icon slug="closed">non conforme</Icon>
        )
      ) : (
        <span />
      )}
      {data.url && (
        <a href={data.url}>
          <Icon slug="download">télécharger</Icon>
        </a>
      )}
    </div>
  );
};

interface IProps extends IDonneesRestreinteUniteLegale {
  uniteLegale: IUniteLegale;
}

export const DonneesRestreintesSection: NextPageWithLayout<IProps> = ({
  uniteLegale,
  conformite: { fiscale, vigilance, msa },
}) => {
  return (
    <PrintNever>
      <ProtectedSection
        title="Conformité & Immatriculation"
        sources={[EAdministration.DINUM]}
      >
        <TwoColumnTable
          body={[
            ['Conformité fiscale', <Conformite data={fiscale} />],
            ['Conformité sociale', <Conformite data={vigilance} />],
            ['Conformité sociale (agricole)', <Conformite data={msa} />],
            [
              'Dirigeants et registre des bénéficiaires effectifs',
              <a href={`/dirigeants/${uniteLegale.siren}`}>
                → Consulter la page dirigeants
              </a>,
            ],
            [
              'Immatriculation au RNE',
              <a href={`/justificatif/${uniteLegale.siren}`}>
                → Consulter la page justificatif d’immatriculation
              </a>,
            ],
            [
              '',
              <a
                href={`/justificatif-immatriculation-pdf/${uniteLegale.siren}`}
              >
                <Icon slug="download">
                  Télécharger l’extrait d’immatriculation au RNE
                </Icon>
              </a>,
            ],
          ]}
        />
      </ProtectedSection>
      <HorizontalSeparator />
    </PrintNever>
  );
};

export default DonneesRestreintesSection;
