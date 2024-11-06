export const isAbsoluteUrl = (path: string) => {
  try {
    new URL(path);
    return true;
  } catch (e) {
    return false;
  }
};
