export const getAbsoluteSiteUrl = (path: string = '') => {
  const baseURL =
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://annuaire-entreprises.data.gouv.fr';

  const url = new URL(path, baseURL);

  return url.href;
};
