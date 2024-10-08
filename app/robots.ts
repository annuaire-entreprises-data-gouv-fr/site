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
        '/departements/',
        '/etablissements/',
        '/lp/',
        '/documents/',
        '/donnees-financieres/',
        '/annonces/',
        '/labels-certificats/',
      ],
      disallow: [
        '/private/',
        '/justificatif-immatriculation-pdf/',
        '/api/',
        '/rechercher/carte',
        '/rechercher/',
        '/dirigeants/',
        '/personne/',
        '/elus/',
        '/divers/',
        '/erreur/',
        '/formulaire/',
      ],
    },
    sitemap: 'https://annuaire-entreprises.data.gouv.fr/sitemap.xml',
  };
}
