interface ICookieStore {
  delete: (name: string) => Promise<void>;
}

export interface IBrowserCookieOptions {
  domain?: string;
  expires?: Date;
  maxAge?: number;
  path?: string;
  sameSite?: "lax" | "strict" | "none" | "Lax" | "Strict" | "None";
  secure?: boolean;
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
    const encodedName = encodeURIComponent(name);
    const value = document.cookie
      .split("; ")
      .find(
        (row) => row.startsWith(`${encodedName}=`) || row.startsWith(`${name}=`)
      );

    if (!value) {
      return null;
    }

    return decodeURIComponent(value.slice(value.indexOf("=") + 1));
  }
  return null;
}

export function setCookieBrowser(
  name: string,
  value: string,
  options: IBrowserCookieOptions = {}
) {
  if (typeof window === "undefined" || !name) {
    return;
  }

  const cookieParts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `path=${options.path || "/"}`,
  ];

  if (options.domain) {
    cookieParts.push(`domain=${options.domain}`);
  }

  if (options.expires) {
    cookieParts.push(`expires=${options.expires.toUTCString()}`);
  }

  if (typeof options.maxAge === "number") {
    cookieParts.push(`max-age=${options.maxAge}`);
  }

  if (options.sameSite) {
    cookieParts.push(`SameSite=${options.sameSite}`);
  }

  if (options.secure) {
    cookieParts.push("secure");
  }

  getDocumentCookieSetter()?.call(document, cookieParts.join("; "));
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
