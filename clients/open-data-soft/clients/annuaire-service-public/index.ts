import { HttpNotFound } from '#clients/exceptions';
import odsClient from '#clients/open-data-soft';
import routes from '#clients/routes';
import { stubClient } from '#clients/stub-client-with-snaphots';
import { IServicePublic } from '#models/service-public';
import { Siret } from '#utils/helpers';

interface IServicePublicRecord {
  adresse: string;
  adresse_courriel: string;
  affectation_personne: string;
  categorie: string;
  formulaire_contact: string;
  mission: string;
  nom: string;
  organigramme: string;
  sigle: string;
  site_internet: string;
  telephone: string;
  type_organisme: string;
  url_service_public: string;
  hierarchie: string;
}

type IServices = { type_hierarchie: string; service: string };

type IAffectationRecord = {
  personne: {
    prenom: string;
    nom: string;
    texte_reference: Array<{
      libelle: string;
      valeur: string;
    }>;
  };
  fonction: string;
};

function firstArrayElement<T>(array: T[], defaultValue: T): T {
  if (array && array.length && array.length > 0) {
    return array[0] ?? defaultValue;
  }
  return defaultValue;
}

function queryAnnuaireServicePublic(whereQuery: string) {
  return odsClient(
    {
      url: routes.annuaireServicePublic.ods.search,
      config: {
        params: { where: whereQuery },
        useCache: true,
      },
    },
    routes.annuaireServicePublic.ods.metadata
  );
}

const clientAnnuaireServicePublicByName = async (
  name: string
): Promise<IServicePublic> => {
  //  Query by name, it allows to find DINUM or ONF for instance.
  //  Todo : bulletproof this

  const response = await queryAnnuaireServicePublic(`search(nom, "${name}")`);

  const record = response.records.find((record: IServicePublicRecord) => {
    const nom = record.nom
      .toUpperCase()
      // Remove accents
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
    return nom === name;
  });
  if (!record) {
    throw new HttpNotFound(`Name = ${name}`);
  }
  return {
    ...mapToDomainObject(record),
    lastModified: response.lastModified,
  };
};

const clientAnnuaireServicePublicByIds = async (
  ids: string[]
): Promise<IServicePublic[]> => {
  const query = `id="${ids.join('" OR id="')}"`;
  let response = await queryAnnuaireServicePublic(query);

  if (!response.records.length) {
    throw new HttpNotFound(`Ids = ${ids.join(', ')}`);
  }

  return response.records.map(mapToDomainObject);
};

const clientAnnuaireServicePublicBySiret = async (
  siret: Siret
): Promise<IServicePublic> => {
  let response = await queryAnnuaireServicePublic(`siret="${siret}"`);

  if (!response.records.length) {
    throw new HttpNotFound(`Siret = ${siret}`);
  }

  return {
    ...mapToDomainObject(response.records[0]),
    lastModified: response.lastModified,
  };
};

const mapToDomainObject = (
  record: IServicePublicRecord
): Omit<IServicePublic, 'lastModified'> => {
  return {
    affectationPersonne: mapToAffectationPersonne(record.affectation_personne),
    liens: mapToLiens(record),
    telephone: mapToTelephone(record.telephone),
    urlServicePublic: record.url_service_public || null,
    adresseCourriel: record.adresse_courriel || null,
    sigle: record.sigle || null,
    categorie: (record.categorie as IServicePublic['categorie']) || null,
    mission: record.mission || null,
    formulaireContact: record.formulaire_contact || null,
    adressePostale: mapToAdresse(record),
    typeOrganisme:
      (record.type_organisme as IServicePublic['typeOrganisme']) || null,
    nom: mapToNom(record),
    subServicesId: mapToServicesId(record.hierarchie),
  };
};

/**
 * List of sub services
 * @param hierarchieSerialized
 * @returns
 */
function mapToServicesId(hierarchieSerialized: string): string[] {
  const hierarchie = JSON.parse(
    hierarchieSerialized || 'null'
  ) as Array<IServices> | null;

  if (!hierarchie || !hierarchie.length) {
    return [];
  }
  return hierarchie.map((service) => service.service);
}

type IAffectationPersonne = IServicePublic['affectationPersonne'];
function mapToAffectationPersonne(
  affectationRecord: string
): IAffectationPersonne {
  const affectations = JSON.parse(
    affectationRecord || 'null'
  ) as Array<IAffectationRecord> | null;

  if (!affectations || !affectations.length) {
    return null;
  }
  return affectations.map((affectation) => ({
    nom: getNom(affectation.personne),
    fonction: affectation.fonction,
    lienTexteAffectation: firstArrayElement(
      affectation.personne.texte_reference,
      null
    ),
  }));
}
function getNom(personne: IAffectationRecord['personne']) {
  if (!personne.prenom && !personne.nom) {
    return null;
  }
  return (
    personne.prenom +
    (personne.nom || personne.prenom ? ' ' + personne.nom : '')
  );
}

function mapToNom(record: IServicePublicRecord) {
  if (!record.nom) {
    return null;
  }
  return record.nom + (record.sigle ? ` (${record.sigle})` : '');
}

function mapToAdresse(record: IServicePublicRecord) {
  const adresses = JSON.parse(record.adresse || '[]') as Array<{
    numero_voie: string;
    type_adresse: string;
    complement1: string;
    complement2: string;
    code_postal: string;
    nom_commune: string;
    pays: string;
  }>;
  if (!adresses.length) {
    return null;
  }
  const adresse =
    adresses.find((a) => a.type_adresse === 'Adresse postale') ??
    firstArrayElement(adresses, null);
  if (!adresse) {
    return null;
  }
  return [
    adresse.complement1,
    adresse.complement2,
    adresse.numero_voie,
    `${adresse.code_postal} ${adresse.nom_commune}`,
    adresse.pays,
  ]
    .filter(Boolean)
    .join(', ');
}

function mapToTelephone(telephoneRecord: string) {
  const telephones = JSON.parse(telephoneRecord || '[]') as Array<{
    valeur: string;
    description: string;
  }>;
  if (!telephones.length) {
    return null;
  }
  return telephones[0].valeur;
}

function mapToLiens(record: IServicePublicRecord) {
  const liens: IServicePublic['liens'] = {
    sitesInternet: [],
    formulaireContact: null,
    annuaireServicePublic: null,
    organigramme: null,
  };
  liens.sitesInternet = (
    JSON.parse(record['site_internet'] || '[]') as Array<{
      valeur: string;
      libelle: string;
    }>
  ).map((site) => ({
    libelle:
      site.libelle ||
      `Site officiel (${site.valeur
        .replace(/^https?:\/\//, '')
        .replace(/^www./, '')})`,
    valeur: site.valeur,
  }));

  if (record['formulaire_contact']) {
    liens.formulaireContact = {
      libelle: 'Accéder au formulaire de contact',
      valeur: record['formulaire_contact'],
    };
  }

  const organigrammes = JSON.parse(record['organigramme'] || '[]') as Array<{
    valeur: string;
    libelle: string;
  }>;
  liens.organigramme = firstArrayElement(organigrammes, null);

  if (record['url_service_public']) {
    liens.annuaireServicePublic = {
      libelle: 'Informations supplémentaires (annuaire du service-public)',
      valeur: record['url_service_public'],
    };
  }

  return liens;
}

const stubbedClientAnnuaireServicePublicByIds = stubClient({
  clientAnnuaireServicePublicByIds,
});

const stubbedClientAnnuaireServicePublicBySiret = stubClient({
  clientAnnuaireServicePublicBySiret,
});

const stubbedClientAnnuaireServicePublicByName = stubClient({
  clientAnnuaireServicePublicByName,
});
export {
  stubbedClientAnnuaireServicePublicByIds as clientAnnuaireServicePublicByIds,
  stubbedClientAnnuaireServicePublicByName as clientAnnuaireServicePublicByName,
  stubbedClientAnnuaireServicePublicBySiret as clientAnnuaireServicePublicBySiret,
};
