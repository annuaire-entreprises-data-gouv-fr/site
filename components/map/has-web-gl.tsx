export const hasWebGLSupport = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  const canvas = document.createElement('canvas');
  const gl =
    canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return gl !== null && gl !== undefined;
};
