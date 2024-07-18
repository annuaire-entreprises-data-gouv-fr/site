import React from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import {
  IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IConformite } from '#models/espace-agent/conformite';

const APINotRespongingElement: React.FC<{
  data: IAPINotRespondingError;
  administration: string;
}> = ({ data, administration }) => {
  return (
    <i>
      {(data?.errorType === 408 && (
        <>
          <Icon slug="alertFill" color="orange">
            La récupération du document auprès des services {administration} a
            pris trop de temps.
          </Icon>
          <br />
          <a href="">Cliquez-ici pour recharger la page</a> ou ré-essayez
          plus-tard.
        </>
      )) || (
        <>
          <Icon slug="errorFill" color="#df0a00">
            La récupération du document auprès des services {administration} a
            échoué.
          </Icon>
          <br />
          Ré-essayez plus tard ou rapprochez-vous de l’entreprise pour lui demander la pièce directement.
        </>
      )}
    </i>
  );
};

const Conformite: React.FC<{
  data: IConformite | IAPINotRespondingError;
  administration: string;
}> = ({ data, administration }) => {
  if (isAPINotResponding(data)) {
    if (isAPI404(data)) {
      return (
        <Icon slug="closed">{administration} : document introuvable.</Icon>
      );
    } else {
      return (
        <APINotRespongingElement data={data} administration={administration} />
      );
    }
  }

  const valid = data.isValid === true;
  const iconSlug = valid ? 'open' : 'closed';
  const label = `${administration} : ${valid ? '' : 'non-'}conforme`;

  return (
    <div className="layout-space-between">
      <Icon slug={iconSlug}>{label}</Icon>
      {data.url && (
        <a href={data.url}>
          <Icon slug="download">{data.label || 'télécharger'}</Icon>
        </a>
      )}
    </div>
  );
};

export default Conformite;
