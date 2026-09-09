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
          complement: dirigeant.adresse_domiciliation.complement,
          numeroVoie: dirigeant.adresse_domiciliation.numero_voie,
          typeVoie: dirigeant.adresse_domiciliation.type_voie,
          libelleVoie: dirigeant.adresse_domiciliation.libelle_voie,
          distribution: dirigeant.adresse_domiciliation.distribution,
          codeInsee: dirigeant.adresse_domiciliation.code_insee,
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
          nom: dirigeant.personne_morale.nom,
          pays: dirigeant.personne_morale.pays,
        }
      : dirigeant.personne_morale,
  })),
  filiation: response.data.filiation.map((lien) => ({
    typeOperation: lien.type_operation,
    identifiant: lien.identifiant,
  })),
  situationFinanciere: {
    anneesSubventionsPubliques:
      response.data.situation_financiere.annees_subventions_publiques,
    anneesAppelGenerositePublique:
      response.data.situation_financiere.annees_appel_generosite_publique,
    anneesFinancementsEtrangers:
      response.data.situation_financiere.annees_financements_etrangers,
  },
  conformiteComptable: {
    etatTransmissionComptes:
      response.data.conformite_comptable.etat_transmission_comptes,
    anneesExercicesComptablesTransmis:
      response.data.conformite_comptable.annees_exercices_comptables_transmis,
  },
  documents: response.data.documents.map((document) => ({
    id: document.id,
    type: document.type,
    nomOriginal: document.nom_original,
    typeMime: document.type_mime,
    dateDepot: document.date_depot,
  })),
});
