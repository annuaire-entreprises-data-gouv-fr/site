import { IAgentConnectUserInfo } from '#clients/authentication/agent-connect/strategy';
import { InternalError } from '#models/exceptions';
import { logWarningInSentry } from '#utils/sentry';
import { IScope, getUserScopes } from './scopes';

const isLikelyPrestataire = (email: string | undefined) => {
  try {
    const domain = (email || '@').split('@')[1];
    if (domain === 'beta.gouv.fr') {
      return true;
    } else {
      if (!!domain.match(/[.@-]*(ext)(ernal|ernes|erne)*[.@-]/g)) {
        return true;
      }
      return false;
    }
  } catch (e) {
    logWarningInSentry(
      new InternalError({
        message: 'Failed to determine agent level',
        cause: e,
      })
    );
    return false;
  }
};

const isFromMCP = (idp_id: string) => {
  if (idp_id === '71144ab3-ee1a-4401-b7b3-79b44f7daeeb') {
    return true;
  } else {
    return false;
  }
};

export type IAgentInfo = {
  email: string;
  familyName: string;
  firstName: string;
  fullName: string;
  siret: string;
  scopes: IScope[];
  userType: string;
  isPrestataire: boolean;
  isMCP: boolean;
};

export const getAgent = async (
  userInfo: IAgentConnectUserInfo
): Promise<IAgentInfo> => {
  const { scopes, userType } = await getUserScopes(userInfo?.email);

  const isPrestataire = isLikelyPrestataire(userInfo?.email);
  const isMCP = isFromMCP(userInfo.idp_id);

  const email = userInfo.email ?? '';
  const familyName = userInfo.family_name ?? '';
  const firstName = userInfo.given_name ?? '';

  return {
    email,
    familyName,
    firstName,
    fullName: familyName ? `${firstName} ${familyName}` : '',
    siret: userInfo.siret ?? '',
    scopes,
    userType,
    isPrestataire,
    isMCP,
  };
};
