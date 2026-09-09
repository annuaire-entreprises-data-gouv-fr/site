import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { PropsWithChildren, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IFondation } from "#/models/core/fondations.types";
import { UseCase } from "#/models/use-cases";
import { getAgentFondationsRestreintesSchema } from "#/server-functions/agent/data-fetching/schemas";
import LiensFondationSection from ".";
import { LiensFondationContent } from "./content";

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
  Link: ({
    children,
    params,
  }: PropsWithChildren<{ params?: { slug: string } }>) => (
    <a href={`/fondation/${params?.slug}`}>{children}</a>
  ),
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
  fetchData.mockReturnValue({
    filiation: [],
  });
});
afterEach(cleanup);

describe("foundation links access", () => {
  it("does not fetch for unauthenticated visitors", () => {
    render(<LiensFondationSection fondation={fondation} user={null} />);
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
    render(<LiensFondationSection fondation={fondation} user={user} />);
    expect(fetchData).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("radio", { name: label }));
    expect(fetchData).toHaveBeenCalledWith(
      "fondations",
      { idRnf: fondation.id, useCase },
      ApplicationRights.isAgent,
      { staleTime: 300_000, gcTime: 1_800_000 }
    );
    expect(screen.getByText(/Aucun lien/)).toBeTruthy();
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
describe("foundation links content", () => {
  it("shows every operation, including repeated operations, and links RNF identifiers", () => {
    render(
      <LiensFondationContent
        filiation={[
          { typeOperation: "Transformation", identifiant: "075-FRUP-00194-01" },
          { typeOperation: "Fusion", identifiant: "W751000001" },
          { typeOperation: "Scission", identifiant: "075-FE-00001-01" },
          { typeOperation: "Scission", identifiant: null },
        ]}
      />
    );
    expect(screen.getAllByRole("table")).toHaveLength(1);
    expect(screen.getByText("Transformation")).toBeTruthy();
    expect(screen.getByText("Fusion")).toBeTruthy();
    expect(screen.getAllByText("Scission")).toHaveLength(2);
    expect(
      screen
        .getByRole("link", { name: "075-FRUP-00194-01" })
        .getAttribute("href")
    ).toBe("/fondation/075-FRUP-00194-01");
    expect(screen.getByText("W751000001")).toBeTruthy();
    expect(screen.queryByRole("link", { name: "W751000001" })).toBeNull();
  });

  it("retains a relationship when its identifier or operation is missing", () => {
    render(
      <LiensFondationContent
        filiation={[{ typeOperation: "Fusion", identifiant: null }, {}]}
      />
    );
    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.getByText("Fusion")).toBeTruthy();
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByText(/Aucun lien/)).toBeNull();
  });

  it("shows an empty state without empty tables", () => {
    render(<LiensFondationContent filiation={[]} />);
    expect(screen.getByText(/Aucun lien/)).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });
});
