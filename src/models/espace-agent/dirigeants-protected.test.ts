import { vi } from "vitest";
import { getDirigeantsRNE } from "#/models/rne/dirigeants";
import type {
  IDirigeants,
  IEtatCivil,
  IPersonneMorale,
} from "#/models/rne/types";
import logErrorInSentry from "#/utils/sentry";
import { getDirigeantsProtected } from "./dirigeants-protected";
import { getMandatairesRCS } from "./mandataires-rcs";

vi.mock("#/models/rne/dirigeants", () => ({
  getDirigeantsRNE: vi.fn(),
}));

vi.mock("#/utils/sentry", () => ({
  default: vi.fn(),
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

const compareDirigeants = async (
  rneData: IDirigeants,
  rcsData: IDirigeants,
  isEI = false
) => {
  mockGetDirigeantsRNE.mockResolvedValue({
    data: rneData,
    metadata: { isFallback: false },
  });
  mockGetMandatairesRCS.mockResolvedValue(rcsData);

  await getDirigeantsProtected(SIREN, { isEI });
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

describe("getDirigeantsProtected RNE/RCS mismatch", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("does not report identical dirigeants in a different order", async () => {
    await compareDirigeants(
      [personnePhysique, personneMorale],
      [personneMorale, personnePhysique]
    );

    expect(mockLogErrorInSentry).not.toHaveBeenCalled();
  });

  it("ignores accents, capitalization, and special characters", async () => {
    await compareDirigeants(
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
    await compareDirigeants(
      [personnePhysique, personneMorale],
      [personnePhysique]
    );

    expectMismatchToHaveBeenLogged();
  });

  it("reports a different role", async () => {
    await compareDirigeants(
      [personnePhysique],
      [{ ...personnePhysique, role: "Directrice générale" }]
    );

    expectMismatchToHaveBeenLogged();
  });

  it("reports a different birthdate", async () => {
    await compareDirigeants(
      [{ ...personnePhysique, dateNaissancePartial: undefined }],
      [
        {
          ...personnePhysique,
          dateNaissance: "1980-01-16",
          dateNaissancePartial: undefined,
        },
      ]
    );

    expectMismatchToHaveBeenLogged();
  });

  it("reports different legal-entity details", async () => {
    await compareDirigeants(
      [personneMorale],
      [{ ...personneMorale, denomination: "Autre société" }]
    );

    expectMismatchToHaveBeenLogged();
  });

  it("does not compare non-standardized individual-enterprise data", async () => {
    await compareDirigeants([personnePhysique], [personneMorale], true);

    expect(mockLogErrorInSentry).not.toHaveBeenCalled();
  });
});
