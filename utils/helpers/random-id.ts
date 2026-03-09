export const randomId = () => {
  const crypto =
    typeof window === "undefined" ? require("node:crypto") : window.crypto;
  return crypto.randomUUID().substring(0, 8);
};
