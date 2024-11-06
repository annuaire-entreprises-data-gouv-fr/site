export const getBaseUrl = () => {
  const baseURL =
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://annuaire-entreprises.data.gouv.fr';

  return baseURL;
};
