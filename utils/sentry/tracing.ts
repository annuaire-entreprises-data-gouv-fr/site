export const getTransactionNameFromUrl = (url: string) => {
  try {
    if (url.indexOf('/entreprise/') === 0) {
      return '/entreprise/[slug]';
    }
    if (url.indexOf('/rechercher/carte') > -1) {
      return '/rechercher/carte';
    } else if (url.indexOf('/rechercher') > -1) {
      return '/rechercher';
    }
    return url.replace('?redirected=1', '').replace(/\d{14}|\d{9}/g, '[slug]');
  } catch {
    return url;
  }
};
