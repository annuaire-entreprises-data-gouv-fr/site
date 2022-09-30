import fs from 'fs';

export const getStaticPages = () => {
  const faqFiles = fs
    .readdirSync('../data/faq')
    .filter((file) => file.indexOf('.yml') > -1)
    .map((file) => {
      return `/faq/${file.replace('.yml', '')}`;
    });

  return [
    '/',
    '/donnees-extrait-kbis',
    '/comment-ca-marche',
    '/administration',
    '/faq',
    '/partager',
    ...faqFiles,
  ];
};
