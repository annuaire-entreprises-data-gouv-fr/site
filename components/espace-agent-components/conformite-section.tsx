import { useEffect, useState } from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import { ProtectedSection } from '#components/section/protected-section';
import { TwoColumnTable } from '#components/table/simple';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import {
  IConformite,
  IDonneesRestreinteUniteLegale,
} from '#models/espace-agent/donnees-restreintes-entreprise';
import { IUniteLegale } from '#models/index';
import { Loader } from '#components-ui/loader';
import { capitalize } from '#utils/helpers';
import { useDonneesRestreintes } from 'hooks';

const AdministrationInformation: React.FC<{
  str: string;
  administration?: string;
}> = ({ str, administration }) => {
  return capitalize(`${administration ? `${administration} : ` : ''}${str}`);
};

const Conformite: React.FC<{
  data: IConformite | IAPINotRespondingError | undefined;
  administration?: string;
  isLoading?: boolean;
}> = ({ data, administration, isLoading = false }) => {
  if (isLoading) {
    return <Loader />;
  }

  if (!data || isAPINotResponding(data)) {
    return (
      <Icon slug="closed">
        {(data?.errorType === 404 && (
          <AdministrationInformation
            str="document non trouvé"
            administration={administration}
          />
        )) ||
          (data?.errorType === 408 && (
            <AdministrationInformation
              str="la récupération du document a pris trop de temps"
              administration={administration}
            />
          )) || (
            <AdministrationInformation
              str={`erreur ${data?.errorType}`}
              administration={administration}
            />
          )}
      </Icon>
    );
  }

  return (
    <div className="layout-space-between">
      {typeof data.isValid === 'boolean' ? (
        data.isValid ? (
          <Icon slug="open">
            <AdministrationInformation
              str="conforme"
              administration={administration}
            />
          </Icon>
        ) : (
          <Icon slug="closed">
            <AdministrationInformation
              str="non conforme"
              administration={administration}
            />
          </Icon>
        )
      ) : (
        <span />
      )}
      {data.url && (
        <a href={data.url}>
          <Icon slug="download">{data.label || 'télécharger'}</Icon>
        </a>
      )}
    </div>
  );
};

const ConformiteSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const { isLoading, donneesRestreintes } = useDonneesRestreintes(uniteLegale);

  return (
    <PrintNever>
      <ProtectedSection title="Conformité">
        <TwoColumnTable
          body={[
            [
              'Conformité fiscale',
              <Conformite
                isLoading={isLoading}
                data={donneesRestreintes?.conformite?.fiscale}
              />,
            ],
            [
              'Conformité sociale',
              <>
                <Conformite
                  isLoading={isLoading}
                  data={donneesRestreintes?.conformite?.vigilance}
                  administration="Urssaf"
                />
                <br />
                <Conformite
                  isLoading={isLoading}
                  data={donneesRestreintes?.conformite?.msa}
                  administration="MSA"
                />
              </>,
            ],
          ]}
        />
      </ProtectedSection>
    </PrintNever>
  );
};

export default ConformiteSection;
