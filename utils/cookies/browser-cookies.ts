interface ICookieStore {
  delete: (name: string) => Promise<void>;
}

const getDocumentCookieSetter = () =>
  Object.getOwnPropertyDescriptor(Document.prototype, "cookie")?.set;

const hasCookieStore = (value: unknown): value is ICookieStore =>
  !!value &&
  typeof value === "object" &&
  "delete" in value &&
  typeof value.delete === "function";

export function getCookieBrowser(name: string): string | null {
  if (typeof window !== "undefined") {
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];

    return value || null;
  }
  return null;
}

export function deleteCookieBrowser(name: string) {
  if (typeof window !== "undefined" && name) {
    if (hasCookieStore(window.cookieStore)) {
      window.cookieStore.delete(name).then(undefined, () => undefined);
      return;
    }

    getDocumentCookieSetter()?.call(
      document,
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    );
  }
}
