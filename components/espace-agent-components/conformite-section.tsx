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
      <i>
        {administration ? `${administration} : e` : 'E'}rreur {data?.errorType}
      </i>
    );
  }

  return (
    <div className="layout-space-between">
      {typeof data.isValid === 'boolean' ? (
        data.isValid ? (
          <Icon slug="open">
            {administration && <b>{administration}&nbsp;: </b>} conforme
          </Icon>
        ) : (
          <Icon slug="closed">
            {administration && <b>{administration}&nbsp;: </b>} non conforme
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
  const [isLoading, setIsLoading] = useState(true);
  const [donneesRestreintes, setDonneesRestreintes] =
    useState<IDonneesRestreinteUniteLegale | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchDonneesRestreintes = async () => {
      const response = await fetch(
        `/api/espace-agent/conformite/${uniteLegale.siege.siret}`
      );
      const data = await response.json();
      setDonneesRestreintes(data);
      setIsLoading(false);
    };

    fetchDonneesRestreintes();
  }, [uniteLegale]);

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
