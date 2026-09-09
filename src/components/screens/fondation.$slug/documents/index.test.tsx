import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { PropsWithChildren, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SummaryDocuments } from "#/components/screens/documents.$slug/summary-documents";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IFondation } from "#/models/core/fondations.types";
import { UseCase } from "#/models/use-cases";
import { getAgentFondationsRestreintesSchema } from "#/server-functions/agent/data-fetching/schemas";
import DocumentsFondationSection from ".";
import { DocumentsFondationContent } from "./content";

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
    documents: [],
  });
});
afterEach(cleanup);

describe("foundation documents access", () => {
  it("does not fetch for unauthenticated visitors", () => {
    render(<DocumentsFondationSection fondation={fondation} user={null} />);
    expect(screen.getByText(/réservés aux agents publics/)).toBeTruthy();
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
    render(<DocumentsFondationSection fondation={fondation} user={user} />);
    expect(fetchData).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("radio", { name: label }));
    expect(fetchData).toHaveBeenCalledWith(
      "fondations",
      { idRnf: fondation.id, useCase },
      ApplicationRights.isAgent,
      { staleTime: 300_000, gcTime: 1_800_000 }
    );
    expect(screen.getByText(/Aucun document/)).toBeTruthy();
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
describe("RNF documents", () => {
  it("sorts documents by deposit date without changing the source", () => {
    const documents = [
      {
        nomOriginal: "Ancien.pdf",
        dateDepot: "2023-01-01",
        typeMime: "application/pdf",
      },
      { nomOriginal: "Sans date", dateDepot: null },
      {
        nomOriginal: "Récent.docx",
        dateDepot: "2024-02-01",
        typeMime:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    ];
    render(<DocumentsFondationContent documents={documents} />);
    const rows = screen.getAllByRole("row");
    expect(rows[1].textContent).toContain("Récent.docx");
    expect(rows[2].textContent).toContain("Ancien.pdf");
    expect(rows[3].textContent).toContain("Sans date");
    expect(screen.getByText("PDF")).toBeTruthy();
    expect(screen.getByText("Word")).toBeTruthy();
    expect(documents[0].nomOriginal).toBe("Ancien.pdf");
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("handles missing metadata and unknown file formats", () => {
    render(
      <DocumentsFondationContent
        documents={[{}, { id: "document-42", typeMime: "application/custom" }]}
      />
    );
    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.getByText("document-42")).toBeTruthy();
    expect(screen.getByText("application/custom")).toBeTruthy();
  });

  it("shows an empty state instead of an empty table", () => {
    render(<DocumentsFondationContent documents={[]} />);
    expect(screen.getByText(/Aucun document/)).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("includes the RNF anchor without entreprise links when no uniteLegale exists", () => {
    render(
      <SummaryDocuments
        additionalSummaryItems={
          <li>
            <a href="#documents-rnf">Documents du RNF</a>
          </li>
        }
        showUniteLegaleDocuments={false}
        user={null}
      />
    );
    expect(
      screen
        .getByRole("link", { name: "Documents du RNF" })
        .getAttribute("href")
    ).toBe("#documents-rnf");
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });
});
