export function getCookieBrowser(name: string): string | null {
  if (typeof window !== 'undefined') {
    const value = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1];

    return value || null;
  }
  return null;
}

export function deleteCookieBrowser(name: string) {
  if (typeof window !== 'undefined' && name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
