export const randomId = () => {
  const crypto =
    // biome-ignore lint/style/useNodejsImportProtocol: needed for webpack
    typeof window === "undefined" ? require("crypto") : window.crypto;
  return crypto.randomUUID().substring(0, 8);
};
