import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { PropsWithChildren, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IFondation } from "#/models/core/fondations.types";
import { UseCase } from "#/models/use-cases";
import { getAgentFondationsRestreintesSchema } from "#/server-functions/agent/data-fetching/schemas";
import DirigeantsFondationSection from ".";
import { DirigeantsFondationContent } from "./content";

const { fetchData } = vi.hoisted(() => ({ fetchData: vi.fn() }));
vi.mock("#/hooks/fetch/use-server-fn-data", () => ({
  useServerFnData: fetchData,
}));
vi.mock("#/server-functions/agent/data-fetching", () => ({
  getAgentFondationsRestreintesFn: "fondations",
}));
vi.mock("#/components/section", () => ({
  Section: ({ title, children }: PropsWithChildren<{ title: string }>) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));
vi.mock("#/components/section/data-section/client", () => ({
  AsyncDataSectionClient: ({
    data,
    children,
  }: {
    data: unknown;
    children: (data: unknown) => ReactNode;
  }) => children(data),
}));
vi.mock("#/components/link", () => ({
  Link: ({ children }: PropsWithChildren) => <span>{children}</span>,
}));

const fondation: IFondation = {
  id: "075-FRUP-00194-01",
  title: "Fondation exemple",
  foundationType: "FRUP",
  creationDate: "1928-08-12",
  postalCode: "75007",
  address: null,
  department: null,
  generalInterestDomain: null,
  hasInternationalActivity: null,
  siren: null,
  siret: null,
  socialObject: null,
  state: null,
  stateEffectiveAt: null,
};
const user: IAgentInfo = {
  scopes: ["agent"],
  email: "agent@example.fr",
  domain: "example.fr",
  familyName: "Agent",
  firstName: "Test",
  fullName: "Test Agent",
  groupsScopes: {},
  idpId: "test",
  isSuperAgent: false,
  proConnectSub: "test",
  siret: "13002526500013",
  userType: "agent",
};

beforeEach(() => {
  fetchData.mockReset();
  fetchData.mockReturnValue({ dirigeants: [] });
});
afterEach(cleanup);

describe("foundation dirigeants access", () => {
  it("does not fetch for unauthenticated visitors", () => {
    render(<DirigeantsFondationSection fondation={fondation} user={null} />);
    expect(screen.getByText(/réservées aux agents publics/)).toBeTruthy();
    expect(fetchData).not.toHaveBeenCalled();
    expect(screen.queryByRole("radio")).toBeNull();
  });

  it.each([
    ["Marchés publics", UseCase.marches],
    ["Lutte contre la fraude", UseCase.fraude],
    ["Aides publiques (aux entreprises)", UseCase.aidesPubliques],
    [
      "Aides publiques (aux associations)",
      UseCase.subventionsFonctionnementAssociation,
    ],
    ["Autre cas d’usage", UseCase.autre],
  ])("fetches by RNF only after selecting %s", (label, useCase) => {
    render(<DirigeantsFondationSection fondation={fondation} user={user} />);
    expect(fetchData).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("radio", { name: label }));
    expect(fetchData).toHaveBeenCalledWith(
      "fondations",
      { idRnf: fondation.id, useCase },
      ApplicationRights.isAgent
    );
    expect(screen.getByText(/Aucun dirigeant/)).toBeTruthy();
  });

  it("rejects missing use cases and invalid identifiers", () => {
    expect(
      getAgentFondationsRestreintesSchema.safeParse({ idRnf: fondation.id })
        .success
    ).toBe(false);
    expect(
      getAgentFondationsRestreintesSchema.safeParse({
        idRnf: "../fondations",
        useCase: UseCase.autre,
      }).success
    ).toBe(false);
    for (const useCase of Object.values(UseCase)) {
      expect(
        getAgentFondationsRestreintesSchema.safeParse({
          idRnf: fondation.id,
          useCase,
        }).success
      ).toBe(true);
    }
  });
});

describe("foundation dirigeants content", () => {
  it("shows identity, mandate and represented organisation while preserving false values", () => {
    render(
      <DirigeantsFondationContent
        dirigeants={[
          {
            prenom: "Marie",
            nom: "Dupont",
            fonction: "Présidente",
            fondateur: false,
            dateEntreeFonction: "2024-01-15",
            dateSortieFonction: "2025-12-31",
            dateNaissance: "1975-04-12",
            nationalite: "Française",
            adresseDomiciliation: {
              complement: "Bâtiment A",
              numeroVoie: "28",
              typeVoie: "Rue",
              libelleVoie: "Saint-Dominique",
              codePostal: "75007",
              commune: "Paris",
            },
            personneMorale: {
              nom: "Organisation exemple",
              identifiant: "784308934",
            },
          },
        ]}
      />
    );
    expect(screen.getByRole("heading", { name: "Marie DUPONT" })).toBeTruthy();
    expect(screen.getByText("Présidente")).toBeTruthy();
    expect(screen.getByText("Non")).toBeTruthy();
    expect(
      screen.getByText("Bâtiment A, 28 Rue Saint-Dominique, 75007 Paris")
    ).toBeTruthy();
    expect(screen.getByText("Organisation exemple")).toBeTruthy();
    expect(screen.getByText("Date de sortie de fonction")).toBeTruthy();
    expect(screen.queryByText("Profession")).toBeNull();
  });

  it("handles an entirely missing identity without rendering empty details", () => {
    render(<DirigeantsFondationContent dirigeants={[{}]} />);
    expect(
      screen.getByRole("heading", { name: "Identité non renseignée" })
    ).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.queryByText("Personne morale représentée")).toBeNull();
  });
});
