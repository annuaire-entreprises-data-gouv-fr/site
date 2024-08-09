import { clientApiEntrepriseBeneficiaires } from '#clients/api-entreprise/beneficiaires';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';

type IModalite = {
  total: number;
  pleine_propriete: number;
  nue_propriete: number;
};

export type IBeneficairesEffectif = {
  nom: string;
  prenoms: string;
  moisNaissance: string;
  anneeNaissance: string;
  nationalite: string;
  paysResidence: string;
  modalites: {
    detention_de_capital: {
      parts_totale: number;
      parts_directes: {
        detention: boolean;
        pleine_propriete: number;
        nue_propriete: number;
      };
      parts_indirectes: {
        detention: boolean;
        par_indivision: IModalite;
        via_personnes_morales: IModalite;
      };
    };
    vocation_a_devenir_titulaire_de_parts: {
      parts_directes: {
        pleine_propriete: number;
        nue_propriete: number;
      };
      parts_indirectes: {
        par_indivision: IModalite;
        via_personnes_morales: IModalite;
      };
    };
    droits_de_vote: {
      total: number;
      directes: {
        detention: boolean;
        pleine_propriete: 51;
        nue_propriete: number;
        usufruit: number;
      };
      indirectes: {
        detention: boolean;
        par_indivision: IModalite & { usufruit: number };
        via_personnes_morales: IModalite & { usufruit: number };
      };
    };
    pouvoirs_de_controle: {
      decision_ag: boolean;
      nommage_membres_conseil_administratif: boolean;
      autres: boolean;
    };
    representant_legal: boolean;
    representant_legal_placement_sans_gestion_deleguee: boolean;
  };
};

export const getBeneficiaires = async (
  maybeSiren: string
): Promise<Array<IBeneficairesEffectif> | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  try {
    const beneficiaires = await clientApiEntrepriseBeneficiaires(siren);
    if (beneficiaires.length === 0) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    }
    return beneficiaires;
  } catch (error) {
    return handleApiEntrepriseError(error, {
      siren,
      apiResource: 'BeneficiairesEffectifs',
    });
  }
};
