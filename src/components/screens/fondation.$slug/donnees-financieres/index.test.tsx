import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import type { PropsWithChildren, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IFondation } from "#/models/core/fondations.types";
import { UseCase } from "#/models/use-cases";
import ConformiteComptableFondationSection from "./conformite-comptable";
import {
  ConformiteComptableFondationContent,
  IndicateursFinanciersFondationContent,
} from "./content";
import IndicateursFinanciersFondationSection from "./indicateurs-financiers";

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

const situationFinanciere = {
  anneesSubventionsPubliques: [2022, 2024, 2023],
  anneesAppelGenerositePublique: [],
  anneesFinancementsEtrangers: [2021],
};
const conformiteComptable = {
  etatTransmissionComptes: "En défaut" as const,
  anneesExercicesComptablesTransmis: [2022, 2023],
};
beforeEach(() => {
  fetchData.mockReset();
  fetchData.mockReturnValue({ situationFinanciere, conformiteComptable });
});
afterEach(cleanup);

it("requires an independent use case for each RNF section", () => {
  render(
    <>
      <IndicateursFinanciersFondationSection
        fondation={fondation}
        user={user}
      />
      <ConformiteComptableFondationSection fondation={fondation} user={user} />
    </>
  );
  expect(fetchData).not.toHaveBeenCalled();
  const indicateurs = screen
    .getByRole("heading", { name: "Indicateurs financiers du RNF" })
    .closest("section");
  const conformite = screen
    .getByRole("heading", { name: "Conformité comptable" })
    .closest("section");
  if (!(indicateurs && conformite)) {
    throw new Error("Missing protected sections");
  }
  fireEvent.click(
    within(indicateurs).getByRole("radio", { name: "Marchés publics" })
  );
  expect(fetchData).toHaveBeenCalledTimes(1);
  expect(fetchData).toHaveBeenLastCalledWith(
    "fondations",
    { idRnf: fondation.id, useCase: UseCase.marches },
    ApplicationRights.isAgent,
    { staleTime: 300_000, gcTime: 1_800_000 }
  );
  expect(within(conformite).getAllByRole("radio")).toHaveLength(5);
  fireEvent.click(
    within(conformite).getByRole("radio", { name: "Autre cas d’usage" })
  );
  expect(fetchData).toHaveBeenLastCalledWith(
    "fondations",
    { idRnf: fondation.id, useCase: UseCase.autre },
    ApplicationRights.isAgent,
    { staleTime: 300_000, gcTime: 1_800_000 }
  );
  expect(screen.getByText("En défaut")).toBeTruthy();
});

it("does not fetch either section for visitors", () => {
  render(
    <>
      <IndicateursFinanciersFondationSection
        fondation={fondation}
        user={null}
      />
      <ConformiteComptableFondationSection fondation={fondation} user={null} />
    </>
  );
  expect(fetchData).not.toHaveBeenCalled();
  expect(screen.queryByRole("radio")).toBeNull();
});

describe("RNF financial information", () => {
  it("orders years without changing the source and distinguishes missing declarations", () => {
    render(
      <IndicateursFinanciersFondationContent
        situationFinanciere={situationFinanciere}
      />
    );
    expect(screen.getByText("2024, 2023, 2022")).toBeTruthy();
    expect(screen.getByText("Aucune année déclarée")).toBeTruthy();
    expect(screen.getByText("2021")).toBeTruthy();
    expect(situationFinanciere.anneesSubventionsPubliques).toEqual([
      2022, 2024, 2023,
    ]);
  });
  it("displays the declared accounting status even with no recorded years", () => {
    render(
      <ConformiteComptableFondationContent
        conformiteComptable={{
          etatTransmissionComptes: "En règle",
          anneesExercicesComptablesTransmis: [],
        }}
      />
    );
    expect(screen.getByText("En règle")).toBeTruthy();
    expect(screen.getByText("Aucune année déclarée")).toBeTruthy();
    expect(screen.queryByText(/signale un retard/)).toBeNull();
  });
  it("explains late filing and displays filed accounting years", () => {
    render(
      <ConformiteComptableFondationContent
        conformiteComptable={conformiteComptable}
      />
    );
    expect(screen.getByText("En défaut")).toBeTruthy();
    expect(screen.getByText("2023, 2022")).toBeTruthy();
    expect(screen.getByText(/signale un retard/)).toBeTruthy();
  });
});
