import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const shouldNotIndex = process.env.INDEXING_ENABLED !== 'enabled';

  if (shouldNotIndex) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/entreprise/',
        '/administration/',
        '/faq/',
        '/definitions/',
        '/departements/',
        '/etablissement/',
        '/lp/',
        '/documents/',
        '/donnees-financieres/',
        '/annonces/',
        '/labels-certificats/',
      ],
      disallow: [
        '/admin/',
        '/private/',
        '/justificatif-immatriculation-pdf/',
        '/api/',
        '/rechercher/carte',
        '/rechercher/',
        '/dirigeants/',
        '/personne/',
        '/divers/',
        '/erreur/',
        '/formulaire/',
        '/carte/',
      ],
    },
    sitemap: 'https://annuaire-entreprises.data.gouv.fr/sitemap.xml',
  };
}
