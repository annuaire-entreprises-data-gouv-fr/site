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
        '/etablissement/',
        '/lp/',
      ],
      disallow: [
        '/private/',
        '/api/',
        '/rechercher/carte',
        '/rechercher/',
        '/justificatif/',
        '/justificatif-immatriculation-pdf/',
        '/annonces/',
        '/dirigeants/',
        '/personne/',
        '/elus/',
        '/divers/',
        '/erreur/',
        '/formulaire/',
        '/carte/',
      ],
    },
    sitemap: 'https://annuaire-entreprises.data.gouv.fr/sitemap.xml',
  };
}
