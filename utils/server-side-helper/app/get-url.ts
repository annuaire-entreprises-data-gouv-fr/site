export const getURL = (path: string = '') => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const url = new URL(path, baseURL);

  return url.href;
};
