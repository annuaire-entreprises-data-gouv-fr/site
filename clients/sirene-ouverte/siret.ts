/**
 * GET ETABLISSEMENT
 */

const getEtablissementSireneOuverte = async (
  siret: string
): Promise<Etablissement | undefined> => {
  if (!isSirenOrSiret(siret)) {
    throw new Error(`Ceci n'est pas un numéro SIRET valide : ${siret}`);
  }

  try {
    const response = await fetch(
      `${routes.sireneOuverte.etablissement}${encodeURI(siret)}`
    );
    if (response.status !== 200) {
      throw new Error(await response.text());
    }
    const result = (await response.json())[0].etablissement;
    const etablissement = result[0];

    return etablissement as Etablissement;
  } catch (e) {
    console.log(e);
    logErrorInSentry(`API Sirene Etalab for ${siret} : ${e}`);
    return undefined;
  }
};

export {
  getEtablissementSireneOuverte,
  getUniteLegaleSireneOuverte,
  getResults,
};
