export const getBaseUrl = () => {
  const baseURL =
    process.env.VITE_BASE_URL || "https://annuaire-entreprises.data.gouv.fr";

  return baseURL;
};
