import { cleanup, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Link } from "#/components/link";
import type { IFondation } from "#/models/core/fondations.types";
import { createDefaultUniteLegale } from "#/models/core/types";
import { verifySiren } from "#/utils/helpers";
import { TabsFondation } from "./tabs";

const location = vi.hoisted(() => ({
  pathname: "/fondation/075-FRUP-00194-01/liens",
}));

vi.mock("@tanstack/react-router", () => ({
  useLocation: ({ select }: { select: (value: typeof location) => unknown }) =>
    select(location),
}));

vi.mock("#/components/link", () => ({
  Link: ({ to, params, children, className }: ComponentProps<typeof Link>) => (
    <a
      className={className}
      href={to?.replace("$slug", (params as { slug: string }).slug)}
    >
      {typeof children === "function"
        ? children({ isActive: false, isTransitioning: false })
        : children}
    </a>
  ),
}));

const fondation: IFondation = {
  id: "075-FRUP-00194-01",
  title: "Maison de la Chimie",
  address: null,
  creationDate: "1928-08-12",
  department: null,
  foundationType: "FRUP",
  generalInterestDomain: null,
  hasInternationalActivity: null,
  postalCode: "75007",
  siren: null,
  siret: null,
  socialObject: null,
  state: null,
  stateEffectiveAt: null,
};

afterEach(cleanup);

describe("foundation tabs", () => {
  it("shows foundation routes without an uniteLegale and marks the current tab", () => {
    render(
      <TabsFondation fondation={fondation} uniteLegale={null} user={null} />
    );

    expect(
      screen.getAllByRole("link").map((link) => link.getAttribute("href"))
    ).toEqual([
      `/fondation/${fondation.id}`,
      `/fondation/${fondation.id}/dirigeants`,
      `/fondation/${fondation.id}/liens`,
      `/fondation/${fondation.id}/documents`,
      `/fondation/${fondation.id}/donnees-financieres`,
    ]);
    expect(
      screen.getByRole("link", { name: "Liens" }).querySelector("h2")
    ).toBeNull();
    expect(
      screen.getByRole("link", { name: "Dirigeants" }).querySelector("h2")
    ).not.toBeNull();
  });

  it("keeps eligible entreprise tabs without duplicating foundation tabs", () => {
    const uniteLegale = createDefaultUniteLegale(verifySiren("784308934"));
    uniteLegale.chemin = "maison-de-la-chimie-784308934";
    uniteLegale.complements.estUai = true;
    uniteLegale.listeIdcc = [{ idcc: "0016", title: "Transports routiers" }];

    render(
      <TabsFondation
        fondation={fondation}
        uniteLegale={uniteLegale}
        user={null}
      />
    );

    expect(screen.getAllByRole("link", { name: "Dirigeants" })).toHaveLength(1);
    expect(
      screen
        .getByRole("link", { name: "Établissements scolaires" })
        .getAttribute("href")
    ).toBe(`/entreprise/${uniteLegale.chemin}/etablissements-scolaires`);
    expect(
      screen
        .getByRole("link", { name: "Conventions collectives" })
        .getAttribute("href")
    ).toBe(`/entreprise/${uniteLegale.chemin}/divers`);
    expect(screen.queryByRole("link", { name: "Effectifs" })).toBeNull();
  });
});
