export const tvaIntracommunautaireFromSiren = (siren: string) => {
  try {
    const tvaNumber = (12 + ((3 * parseInt(siren, 10)) % 97)) % 97;
    return `FR${tvaNumber < 10 ? '0' : ''}${tvaNumber}${siren}`;
  } catch (e: any) {
    return '';
  }
};
