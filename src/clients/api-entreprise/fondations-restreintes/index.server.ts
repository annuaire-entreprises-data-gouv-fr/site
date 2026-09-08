import routes from "#/clients/routes";
import type { IAgentScope } from "#/models/authentication/agent/scopes/constants";
import type { IFondationsRestreintes } from "#/models/espace-agent/fondations-restreintes/types";
import type { UseCase } from "#/models/use-cases";
import clientAPIEntreprise from "../client.server";
import type { IAPIEntrepriseFondationsRestreintes } from "./types";

/**
 * GET restricted foundation data from API Entreprise by SIREN, SIRET or RNF.
 */
export async function clientApiEntrepriseFondationsRestreintes(
  sirenOrSiretOrRnf: string,
  scope: IAgentScope | null,
  useCase?: UseCase
) {
  return await clientAPIEntreprise<
    IAPIEntrepriseFondationsRestreintes,
    IFondationsRestreintes
  >(
    routes.apiEntreprise.fondationsRestreintes(sirenOrSiretOrRnf),
    mapToDomainObject,
    { scope, useCase }
  );
}

const mapToDomainObject = (
  response: IAPIEntrepriseFondationsRestreintes
): IFondationsRestreintes => ({
  dirigeants: response.data.dirigeants.map((dirigeant) => ({
    nom: dirigeant.nom,
    prenom: dirigeant.prenom,
    dateNaissance: dirigeant.date_naissance,
    nationalite: dirigeant.nationalite,
    adresseDomiciliation: dirigeant.adresse_domiciliation
      ? {
          adresseComplete: dirigeant.adresse_domiciliation.adresse_complete,
          codePostal: dirigeant.adresse_domiciliation.code_postal,
          commune: dirigeant.adresse_domiciliation.commune,
          pays: dirigeant.adresse_domiciliation.pays,
        }
      : undefined,
    paysResidence: dirigeant.pays_residence,
    profession: dirigeant.profession,
    dateEntreeFonction: dirigeant.date_entree_fonction,
    dateSortieFonction: dirigeant.date_sortie_fonction,
    fonction: dirigeant.fonction,
    qualite: dirigeant.qualite,
    fondateur: dirigeant.fondateur,
    personneMorale: dirigeant.personne_morale
      ? {
          type: dirigeant.personne_morale.type,
          identifiant: dirigeant.personne_morale.identifiant,
          denomination: dirigeant.personne_morale.denomination,
          pays: dirigeant.personne_morale.pays,
        }
      : dirigeant.personne_morale,
  })),
  liensEntreOrganismes: {
    organismeIssuTransformation: response.data.liens_entre_organismes
      .organisme_issu_transformation
      ? {
          type: response.data.liens_entre_organismes
            .organisme_issu_transformation.type,
          identifiant:
            response.data.liens_entre_organismes.organisme_issu_transformation
              .identifiant,
        }
      : null,
    organismeIssuFusion: response.data.liens_entre_organismes
      .organisme_issu_fusion
      ? {
          type: response.data.liens_entre_organismes.organisme_issu_fusion.type,
          identifiant:
            response.data.liens_entre_organismes.organisme_issu_fusion
              .identifiant,
        }
      : null,
    organismesIssusScission:
      response.data.liens_entre_organismes.organismes_issus_scission.map(
        (organisme) => ({
          type: organisme.type,
          identifiant: organisme.identifiant,
        })
      ),
  },
  situationFinanciere: {
    anneesSubventionsPubliques:
      response.data.situation_financiere.annees_subventions_publiques,
    anneesAppelGenerositePublique:
      response.data.situation_financiere.annees_appel_generosite_publique,
    anneesFinancementsEtrangers:
      response.data.situation_financiere.annees_financements_etrangers,
  },
  dossiers: {
    etatTransmissionComptes: response.data.dossiers.etat_transmission_comptes,
    exercicesComptablesTransmis:
      response.data.dossiers.exercices_comptables_transmis,
  },
  documents: response.data.documents.map((document) => ({
    id: document.id,
    type: document.type,
    nomOriginal: document.nom_original,
    typeMime: document.type_mime,
    dateDepot: document.date_depot,
  })),
});
