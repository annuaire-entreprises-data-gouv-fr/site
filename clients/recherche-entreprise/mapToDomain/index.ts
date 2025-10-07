import {
  createDefaultEtablissement,
  type IEtablissement,
} from "#models/core/types";
import type { IEtatCivil, IPersonneMorale } from "#models/rne/types";
import {
  extractNicFromSiret,
  extractSirenFromSiret,
  formatFirstNames,
  formatLastName,
  formatRole,
  isEntrepreneurIndividuelFromNatureJuridique,
  isSocietePersonnePhysiqueFromNatureJuridique,
  type Siret,
  verifySiret,
} from "#utils/helpers";
import { libelleFromCodeNAFWithoutNomenclature } from "#utils/helpers/formatting/labels";
import {
  etatFromEtatAdministratifInsee,
  parseDateCreationInsee,
  statuDiffusionFromStatutDiffusionInsee,
} from "#utils/helpers/insee-variables";
import { getCapital, getDateFin } from "#utils/helpers/rne-variables";
import type {
  IDirigeant,
  IMatchingEtablissement,
  IResult,
  ISiege,
} from "../interface";

export const mapToImmatriculation = (i: IResult["immatriculation"] | null) => {
  if (!i) {
    return null;
  }

  const duree = i?.duree_personne_morale ?? 0;
  const dateImmatriculation = i?.date_immatriculation ?? "";
  return {
    dateDebutActivite: i?.date_debut_activite ?? "",
    dateRadiation: i?.date_radiation ?? "",
    dateImmatriculation,
    duree,
    dateFin: getDateFin(duree, dateImmatriculation),
    natureEntreprise: i?.nature_entreprise || [],
    dateCloture: i?.date_cloture_exercice ?? "",
    isPersonneMorale: !!i?.capital_social,
    capital: getCapital(
      i?.capital_social ?? 0,
      i?.devise_capital ?? "",
      i?.capital_variable ?? false
    ),
  };
};

export const mapToSiege = (
  siege: IResult["siege"],
  natureJuridique: string
) => {
  if (!siege || Object.keys(siege).length === 0 || !siege.siret) {
    return {
      ...createDefaultEtablissement(),
      siret: "" as Siret,
    };
  }
  return mapToEtablissement(siege, natureJuridique);
};

export const mapToDirigeantModel = (
  dirigeant: IDirigeant
): IEtatCivil | IPersonneMorale => {
  const {
    siren = "",
    sigle = "",
    denomination = "",
    nom = "",
    qualite = "",
    date_de_naissance = "",
    nationalite = "",
  } = dirigeant;
  if (dirigeant.siren) {
    return {
      siren,
      denomination: `${denomination}${sigle ? ` (${sigle})` : ""}`,
      role: formatRole(qualite),
    } as IPersonneMorale;
  }
  const { prenom, prenoms } = formatFirstNames(dirigeant.prenoms, " ");

  return {
    sexe: null,
    nom: formatLastName(nom),
    prenom,
    prenoms,
    role: formatRole(qualite),
    nationalite,
    dateNaissancePartial: date_de_naissance,
  };
};

export const mapToElusModel = (eluRaw: any): IEtatCivil => {
  const { nom, annee_de_naissance, fonction, sexe } = eluRaw;
  const { prenom, prenoms } = formatFirstNames(eluRaw.prenoms, " ");

  return {
    sexe,
    nom: formatLastName(nom),
    prenom,
    prenoms,
    role: fonction,
    dateNaissancePartial: annee_de_naissance,
    lieuNaissance: "",
  };
};

export const mapToEtablissement = (
  etablissement: ISiege | IMatchingEtablissement,
  natureJuridique: string
): IEtablissement => {
  const {
    siret,
    latitude = "0",
    longitude = "0",
    code_postal = "",
    libelle_commune = "",
    adresse,
    liste_enseignes,
    etat_administratif,
    est_siege = false,
    ancien_siege = false,
    nom_commercial = "",
    activite_principale = "",
    date_creation = "",
    date_debut_activite = "",
    date_fermeture = "",
    tranche_effectif_salarie = "",
    caractere_employeur = "",
    annee_tranche_effectif_salarie = "",
    liste_finess = [],
    liste_id_bio = [],
    liste_idcc = [],
    liste_id_organisme_formation = [],
    liste_rge = [],
    liste_uai = [],
    statut_diffusion_etablissement,
  } = etablissement;

  const enseigne = (liste_enseignes || []).join(" ");

  const adressePostale = adresse
    ? `${
        enseigne ? `${enseigne}, ` : nom_commercial ? `${nom_commercial}, ` : ""
      }${adresse}`
    : "";

  const etatAdministratif = etatFromEtatAdministratifInsee(
    etat_administratif,
    siret
  );

  const estEntrepreneurIndividuel =
    isEntrepreneurIndividuelFromNatureJuridique(natureJuridique);
  const estPersonneMorale = !(
    estEntrepreneurIndividuel ||
    isSocietePersonnePhysiqueFromNatureJuridique(natureJuridique)
  );

  return {
    ...createDefaultEtablissement(),
    siren: extractSirenFromSiret(siret),
    enseigne,
    nic: extractNicFromSiret(siret),
    siret: verifySiret(siret),
    adresse,
    codePostal: code_postal,
    commune: libelle_commune,
    adressePostale,
    trancheEffectif:
      caractere_employeur === "N"
        ? caractere_employeur
        : tranche_effectif_salarie,
    anneeTrancheEffectif: annee_tranche_effectif_salarie,
    latitude,
    longitude,
    estSiege: est_siege,
    ancienSiege: ancien_siege,
    etatAdministratif,
    statutDiffusion: statuDiffusionFromStatutDiffusionInsee(
      statut_diffusion_etablissement || "O",
      siret
    ),
    denomination: nom_commercial,
    libelleActivitePrincipale:
      libelleFromCodeNAFWithoutNomenclature(activite_principale),
    activitePrincipale: activite_principale,
    dateCreation: parseDateCreationInsee(date_creation),
    dateDebutActivite: date_debut_activite ?? "",
    dateFermeture: date_fermeture ?? "",
    complements: {
      estEntrepreneurIndividuel,
      estPersonneMorale,
      idFiness: liste_finess || [],
      idBio: liste_id_bio || [],
      idOrganismeFormation: liste_id_organisme_formation || [],
      idRge: liste_rge || [],
      idUai: liste_uai || [],
    },
    listeIdcc: (liste_idcc || []).map((idcc) => {
      // as etablissement will undergo a refacto, we prefer a simpler implem with no title
      return { idcc, title: "" };
    }),
  };
};
