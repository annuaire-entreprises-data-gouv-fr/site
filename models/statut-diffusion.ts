export enum ISTATUTDIFFUSION {
  PARTIAL = 'partiellement diffusible',
  NONDIFF = 'non-diffusible',
  DIFFUSIBLE = 'diffusible',
}

export const estDiffusible = (uniteLegaleOrEtablissement: {
  statutDiffusion: ISTATUTDIFFUSION;
}) => {
  return (
    uniteLegaleOrEtablissement.statutDiffusion === ISTATUTDIFFUSION.DIFFUSIBLE
  );
};
