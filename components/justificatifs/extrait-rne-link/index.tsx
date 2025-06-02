import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import {
  documentNonDiffusiblePlaceHolder,
  estDiffusible,
} from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
import React from 'react';

const ExtraitRNELink: React.FC<{
  uniteLegale: IUniteLegale;
  label?: string;
  session: ISession | null;
}> = ({ uniteLegale, label, session }) => {
  const downloadLink = `${routes.rne.portail.pdf}?format=pdf&ids=[%22${uniteLegale.siren}%22]`;

  return estDiffusible(uniteLegale) ||
    hasRights(session, ApplicationRights.nonDiffusible) ? (
    <ButtonLink small alt to={downloadLink} target="_blank">
      <Icon slug="download">{label || 'télécharger'}</Icon>
    </ButtonLink>
  ) : (
    <a href="/faq/justificatif-immatriculation-non-diffusible">
      {documentNonDiffusiblePlaceHolder(uniteLegale)}
    </a>
  );
};

export default ExtraitRNELink;
