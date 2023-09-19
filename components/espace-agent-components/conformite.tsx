import { Icon } from "#components-ui/icon/wrapper";
import { Loader } from "#components-ui/loader";
import { IAPINotRespondingError, isAPINotResponding } from "#models/api-not-responding";
import { IConformite } from "#models/espace-agent/donnees-restreintes-entreprise";
import AdministrationInformation from "./administration-information";

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

export default Conformite;
