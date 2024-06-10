import { IAPINotRespondingError } from '#models/api-not-responding';
import { getCarteProfessionnelleTravauxPublic } from '#models/espace-agent/carte-professionnelle-travaux-publics';
import { EScope } from '#models/user/rights';

const NotImplementedHandler = () => {
  throw new Error('Not implemented');
};

export const APIHandler = {
  'espace-agent/carte-professionnelle-TP': getCarteProfessionnelleTravauxPublic,
  'espace-agent/conformite': NotImplementedHandler,
  'espace-agent/opqibi': NotImplementedHandler,
  'espace-agent/qualibat': NotImplementedHandler,
  'espace-agent/qualifelec': NotImplementedHandler,
  'espace-agent/rcs-mandataires': NotImplementedHandler,
  'espace-agent/rne/documents': NotImplementedHandler,
  rne: NotImplementedHandler,
  association: NotImplementedHandler,
  'verify-tva': NotImplementedHandler,
  geo: NotImplementedHandler,
  stats: NotImplementedHandler,
} as const;

export type APIPath = keyof typeof APIHandler;

export const APIRoutesScope: Record<APIPath, EScope> = {
  'espace-agent/carte-professionnelle-TP':
    EScope.carteProfessionnelleTravauxPublics,
  'espace-agent/conformite': EScope.conformite,
  'espace-agent/opqibi': EScope.protectedCertificats,
  'espace-agent/qualibat': EScope.protectedCertificats,
  'espace-agent/qualifelec': EScope.protectedCertificats,
  'espace-agent/rcs-mandataires': EScope.mandatairesRCS,
  'espace-agent/rne/documents': EScope.documentsRne,
  rne: EScope.none,
  association: EScope.none,
  'verify-tva': EScope.none,
  geo: EScope.none,
  stats: EScope.none,
} as const;

export type APIHandler<T> = (
  slug: string,
  agentSiret?: string
) => Promise<T | IAPINotRespondingError>;

export type RouteResponse<T> = T extends APIPath
  ? Unpromisify<ReturnType<(typeof APIHandler)[T]>>
  : never;

type Unpromisify<T> = T extends Promise<infer U> ? U : T;
