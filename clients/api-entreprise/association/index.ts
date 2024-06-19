// import routes from '#clients/routes';
// import { Siren } from '#utils/helpers';
// import clientAPIEntreprise from '../client';
// import { IAPIEntrepriseAssociation } from './types';

// /**
//  * GET association from API Entreprise
//  */
// export const clientApiEntrepriseAssociation = async (siren: Siren) => {
//   return await clientAPIEntreprise<IAPIEntrepriseAssociation, unknown>(
//     `${
//       process.env.API_ENTREPRISE_URL
//     }${routes.apiEntreprise.association.replace('{siren}', siren)}`,
//     mapToDomainObject
//   );
// };

// const mapToDomainObject = (response: IAPIEntrepriseAssociation): unknown => {
//   return {
//     documentsRna: response.data.documents_rna,
//     documentsDac: response.data.etablissements.flatMap((e) => {
//       return { siret: e.siret, ...e.documents_dac };
//     }),
//   };
// };
