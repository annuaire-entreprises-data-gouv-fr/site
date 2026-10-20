export const hasWebGLSupport = () => {
  if (typeof window === "undefined") {
    return false;
  }
  // maplibre-gl v6 requires WebGL2 and throws when it is unavailable
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2");
  return gl !== null && gl !== undefined;
};
