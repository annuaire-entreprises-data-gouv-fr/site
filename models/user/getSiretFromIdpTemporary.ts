const idpToSiret: Record<string, string> = {
  'a576f9b4-945b-4cd9-9bbf-811828215a70': '11002001300097', // 'Agents de l'Administration Centrale des ministères économiques et financiers (Réseau Interministériel de l'État)'],
  '115867c0-42dd-47be-a3c0-da05d5ac34f3': '18004301001485', // 'Réseau Canopé'],
  '4106b71b-094a-48f0-974a-cb2c2a9649b3': '11006801200050', // 'Cerbère (Réseau Interministériel de l'État)'],
  '705c8168-fdf9-4305-8026-bc1b34cc101d': '12002503600035', // 'DGCCRF'],
  'b95309cd-b87d-460d-be2d-f8086965290f': '11001401600015', // 'Extensso'],
  '378fe267-7b90-4949-a051-66042ba7d95a': '13000495500014', // 'Agents de la DGFiP (Réseau Interministériel de l'État)'],
  'a36b137b-3fb9-4ae8-add5-365e80a790e1': '11000601200014', // 'Fournisseur d'identités AROBAS pour les agents du MAE (Réseau Interministériel de l'État)'],
  '7c7223d0-38f2-4828-a4a6-aa6cd5023ab8': '13001831000016', // 'Authentification RIE Orion du CEREMA (Réseau Interministériel de l'État)'],
  'cbbae5e2-44e5-4181-b42d-e387d83083d3': '11001401600015', // 'Passage2 (Réseau Interministériel de l'État)'],
  'aff5881f-3cff-4489-9c95-c0792fc25813': '25691018300035', // 'SSO DOUANE / DGDDI (Réseau Interministériel de l'État)'],
  'c5812e30-443e-4811-a63c-f943b842edeb': '11000002300017', // 'Sénat'],
  'cbbfd2a5-490b-4736-ae70-a749a1e72f8d': '12002701600563', // 'Agents de l'Insee (Réseau Interministériel de l'État)'],
  'e2f397e0-f2a5-4cbb-b19f-8b3b54410c26': '11002001300097', // 'Agents de l'Administration Centrale des ministères économiques et financiers (Réseau Interministériel de l'État)'],
  'ee89db94-64de-4e14-b31a-e93ed3ab1168': '11001401600015', // 'Calypsso (Police Nationale)'],
  'd8cddcd6-4104-4d41-b3a9-705e7d01ccad': '11006801200050', // 'Cerbère'],
  'e7782e47-8e0f-4b94-8e21-1197cb6e7143': '11001401600015', // 'Curasso (Gendarmerie Nationale)'],
  'ee56b416-7caa-446d-bfa7-d06af7ba00bd': '12002503600035', // 'DGCCRF'],
  '431bb83a-db72-4a1a-9ef0-136412b7b133': '12002701600563', // 'Fournisseur d'identités pour les agents de l'Insee'],
  '4dbd03fa-b7a1-426f-b18a-cae70dd26d56': '13000495500014', // 'Agents de la DGFiP (Réseau Interministériel de l'État)'],
  '7e327dfa-d462-4460-9691-2701700072bf': '11000601200014', // 'Fournisseur d'identités AROBAS pour les agents du MAE'],
  '200e2f86-fc01-49cf-958f-eb03977f116f': '18007003901803', // 'INRAE - Institut national de recherche pour l'agriculture, l'alimentation et l'environnement'],
  '03f917ba-75e3-4df0-b9f8-7b9b944d8d8d': '18008904700013', // 'INRIA'],
  '4cb81d41-16a4-46d8-a861-06f8d16ab9b9': '18003604800015', // 'INSERM'],
  'bcb4b83a-5ee6-4f67-a721-52521b81d910': '11004601800013', // 'SSO Ministère de la Culture'],
  '3f3b319e-3be5-4031-90f7-e79d1b3ecdf2': '13001831000016', // 'Authentification Orion du CEREMA'],
  '3c69d88b-bf93-4bcd-9f58-714ddff9c343': '11001401600015', // 'Passage2 (Réseau Interministériel de l'État)'],
  '9c895aa2-132e-4592-a713-1fa2fe42c39c': '18008947600055', // 'Passerelle Fédération Éducation Recherche'],
  '5b9d24d9-e1af-4bf7-9586-b2adcb45ef79': '18004301001485', // 'RÉSEAU CANOPÉ'],
  '3a259af6-8cb5-41ef-9d57-4e489590186a': '25691018300035', // 'SSO DOUANE / DGDDI (Réseau Interministériel de l'État)'],
  '90a0db90-db8a-4fe7-a17e-e97afd3e4a24': '11000002300017', // 'Sénat'],
  '4d6fb724-20c8-467d-8d06-6de127624fc0': '25691018300035', // 'Territoire Numérique Ouvert'],
  '311d582f-0be6-47fb-b9ec-e54a874b8fee': '77568501900587', // 'CEA - Commissariat à l'énergie atomique et aux énergies Alternatives'],
  'fb401517-ee06-4b78-b86c-b6988f5a71f4': '17991092200014', // 'Open Desk'],
  'bb784654-d8e8-482c-862b-dc8ee08bf575': '38529030900454', // 'ADEME'],
  'bfa0e843-811f-4465-8119-abc659602568': '20004503700047', // 'Eure Normandie Numérique'],
  'bc064a76-0aab-4c89-af86-8f78a5e68aca': '11001001400014', // 'Ministère de la Justice'],
  '8c39cf91-3f15-43fd-b05b-b9de90d9e9d8': '11004301500012', // 'Applications de l'Éducation Nationale'],
  'ee501034-69e8-48a2-b307-4ce20d75570e': '20004311500019', // 'e-Collectivités'],
  '9e139e69-de07-4cbe-987f-d12cb38c0368': '11001001400014', // 'Ministère de la Justice'],
  'fe5573f8-df86-4c92-b792-f36161bf677e': '13000548100010', // 'PEAMA (France Travail)'],
  'b3889a90-2d2e-492a-b55e-4bf4cbbef9dc': '13000680200016', // 'Ministère Chargé des Affaires Sociales'],
  'c018aec3-718e-459a-ae83-43f7a2173b25': '13000680200016', // 'Ministère Chargé des Affaires Sociales'],
  '52fcebf9-be27-40c7-ba1a-af955f59abd0': '20001004900076', // 'Gironde Numérique'],
  '8da7b85b-e1f3-4269-b3bf-2d051b86e95f': '11007001800012', // 'MASA'],
};

const getSiretFromIdpTemporary = (idpId: string): string => {
  if (idpId && idpToSiret[idpId]) {
    return idpToSiret[idpId];
  }
  return '';
};

export default getSiretFromIdpTemporary;
