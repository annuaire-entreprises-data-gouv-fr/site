const CODE_INSEE_OVERWRITE: Record<string, string> = {
  "75": "75056",
};

export const getCodeInseeToUse = (codeInsee: string): string =>
  CODE_INSEE_OVERWRITE[codeInsee] || codeInsee;
