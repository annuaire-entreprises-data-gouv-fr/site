import fs from 'fs';

export const getStaticPages = () => {
  const faqPages = fs
    .readdirSync('./data/faq')
    .filter((file) => file.indexOf('.yml') > -1)
    .map((file) => {
      return `/faq/${file.replace('.yml', '')}`;
    });

  const lpPages = fs
    .readdirSync('./data/landing-pages')
    .filter((file) => file.indexOf('.yml') > -1)
    .map((file) => {
      return `/lp/${file.replace('.yml', '')}`;
    });

  return [
    '/',
    '/donnees-extrait-kbis',
    '/comment-ca-marche',
    '/administration',
    '/faq',
    '/partager',
    ...faqPages,
    ...lpPages,
  ];
};
