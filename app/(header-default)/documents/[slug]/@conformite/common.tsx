import { EAdministration } from '#models/administrations/EAdministration';

export const sectionInfo = {
  title: 'Conformité',
  id: 'conformite',
  isProtected: true,
  sources: [EAdministration.DGFIP, EAdministration.URSSAF, EAdministration.MSA],
};
