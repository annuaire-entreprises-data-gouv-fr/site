import { vi } from "vitest";
import { getDirigeantsRNE } from "#/models/rne/dirigeants";
import type {
  IDirigeants,
  IEtatCivil,
  IPersonneMorale,
} from "#/models/rne/types";
import { logErrorInSentry } from "#/utils/sentry";
import { getDirigeantsProtected } from "./dirigeants-protected";
import { getMandatairesRCS } from "./mandataires-rcs";

vi.mock("#/models/rne/dirigeants", () => ({
  getDirigeantsRNE: vi.fn(),
}));

vi.mock("#/utils/sentry", () => ({
  logErrorInSentry: vi.fn(),
}));

vi.mock("./mandataires-rcs", () => ({
  getMandatairesRCS: vi.fn(),
}));

const SIREN = "552100554";

const personnePhysique: IEtatCivil = {
  sexe: null,
  nom: "DUPONT",
  prenom: "Élodie",
  prenoms: "Élodie, Anne",
  role: "Présidente",
  dateNaissance: "1980-01-15",
  dateNaissancePartial: "1980-01",
  lieuNaissance: "Paris",
  nationalite: "Française",
  estDemissionnaire: false,
  dateDemission: null,
};

const personneMorale: IPersonneMorale = {
  siren: "784824153",
  denomination: "Société d'Audit",
  natureJuridique: "SAS",
  role: "Commissaire aux comptes",
};

const mockGetDirigeantsRNE = vi.mocked(getDirigeantsRNE);
const mockGetMandatairesRCS = vi.mocked(getMandatairesRCS);
const mockLogErrorInSentry = vi.mocked(logErrorInSentry);

const fetchDirigeants = async (
  rneData: IDirigeants,
  rcsData: IDirigeants,
  {
    isEI = false,
    isUniteLegaleProtected = false,
    canSeeJourNaissanceDirigeants = false,
  } = {}
) => {
  mockGetDirigeantsRNE.mockResolvedValue({
    data: rneData,
    metadata: { isFallback: false },
  });
  mockGetMandatairesRCS.mockResolvedValue(rcsData);

  return await getDirigeantsProtected(SIREN, {
    isEI,
    isUniteLegaleProtected,
    canSeeJourNaissanceDirigeants,
  });
};

const expectMismatchToHaveBeenLogged = () => {
  expect(mockLogErrorInSentry).toHaveBeenCalledTimes(1);
  expect(mockLogErrorInSentry).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "DirigeantsRNERCSMismatch",
      message: "Dirigeants RNE/RCS mismatch",
      context: { siren: SIREN },
    })
  );
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("getDirigeantsProtected RNE fallback", () => {
  it.each([
    { isUniteLegaleProtected: true, canFallback: false },
    { isUniteLegaleProtected: false, canFallback: true },
  ])(
    "passes canFallback=$canFallback when isUniteLegaleProtected=$isUniteLegaleProtected",
    async ({ isUniteLegaleProtected, canFallback }) => {
      await fetchDirigeants([], [], { isUniteLegaleProtected });

      expect(mockGetDirigeantsRNE).toHaveBeenCalledWith(SIREN, { canFallback });
    }
  );
});

describe("getDirigeantsProtected birthdate visibility", () => {
  it.each([
    {
      canSeeJourNaissanceDirigeants: true,
      expectedDateNaissance: personnePhysique.dateNaissance,
    },
    {
      canSeeJourNaissanceDirigeants: false,
      expectedDateNaissance: undefined,
    },
  ])(
    "returns dateNaissance=$expectedDateNaissance when canSeeJourNaissanceDirigeants=$canSeeJourNaissanceDirigeants",
    async ({ canSeeJourNaissanceDirigeants, expectedDateNaissance }) => {
      const result = await fetchDirigeants(
        [{ ...personnePhysique, dateNaissance: undefined }],
        [personnePhysique],
        { canSeeJourNaissanceDirigeants }
      );

      expect(result).toMatchObject({
        data: [
          {
            dateNaissance: expectedDateNaissance,
            dateNaissancePartial: personnePhysique.dateNaissancePartial,
            isInIg: true,
            isInInpi: true,
          },
        ],
      });
    }
  );
});

describe("getDirigeantsProtected RNE/RCS mismatch", () => {
  it("does not report identical dirigeants in a different order", async () => {
    await fetchDirigeants(
      [personnePhysique, personneMorale],
      [personneMorale, personnePhysique]
    );

    expect(mockLogErrorInSentry).not.toHaveBeenCalled();
  });

  it("ignores accents, capitalization, and special characters", async () => {
    await fetchDirigeants(
      [personnePhysique, personneMorale],
      [
        {
          ...personnePhysique,
          nom: "du-pont",
          prenom: "ELODIE",
          prenoms: "ELODIE ANNE",
          role: "PRESIDENTE!",
          dateNaissancePartial: "1980/01",
        },
        {
          ...personneMorale,
          denomination: "SOCIETE D AUDIT",
          role: "COMMISSAIRE-AUX-COMPTES",
        },
      ]
    );

    expect(mockLogErrorInSentry).not.toHaveBeenCalled();
  });

  it("reports a dirigeant missing from one source", async () => {
    await fetchDirigeants(
      [personnePhysique, personneMorale],
      [personnePhysique]
    );

    expectMismatchToHaveBeenLogged();
  });

  it("reports a different role", async () => {
    await fetchDirigeants(
      [personnePhysique],
      [{ ...personnePhysique, role: "Directrice générale" }]
    );

    expectMismatchToHaveBeenLogged();
  });

  it("reports a different birthdate", async () => {
    await fetchDirigeants(
      [{ ...personnePhysique, dateNaissancePartial: undefined }],
      [
        {
          ...personnePhysique,
          dateNaissance: "1980-01-16",
          dateNaissancePartial: undefined,
        },
      ],
      { canSeeJourNaissanceDirigeants: true }
    );

    expectMismatchToHaveBeenLogged();
  });

  it("reports different legal-entity details", async () => {
    await fetchDirigeants(
      [personneMorale],
      [{ ...personneMorale, denomination: "Autre société" }]
    );

    expectMismatchToHaveBeenLogged();
  });

  it("does not compare non-standardized individual-enterprise data", async () => {
    await fetchDirigeants([personnePhysique], [personneMorale], {
      isEI: true,
    });

    expect(mockLogErrorInSentry).not.toHaveBeenCalled();
  });
});
