import { cleanup, render, screen } from "@testing-library/react";
import type { ComponentProps, PropsWithChildren } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { LineChart } from "#/components/chart/line";
import type { StackedBarChart } from "#/components/chart/stack-bar";
import type {
  ICollectiviteEffectifsSalaries,
  ICollectiviteFluxOuvertureEtablissements,
} from "#/models/collectivite/economie-locale";
import { CollectiviteEconomieLocaleSection } from ".";
import { CollectiviteFluxEtablissementsSection } from "./flux-etablissements";

const { renderLineChart, renderBarChart } = vi.hoisted(() => ({
  renderLineChart: vi.fn<(props: ComponentProps<typeof LineChart>) => null>(
    () => null
  ),
  renderBarChart: vi.fn<
    (props: ComponentProps<typeof StackedBarChart>) => null
  >(() => null),
}));

vi.mock("#/components/chart/line", () => ({ LineChart: renderLineChart }));
vi.mock("#/components/chart/stack-bar", () => ({
  StackedBarChart: renderBarChart,
}));
vi.mock("#/components/section", () => ({
  Section: ({ title, children }: PropsWithChildren<{ title: string }>) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));

beforeEach(() => {
  renderLineChart.mockClear();
  renderBarChart.mockClear();
});
afterEach(cleanup);

describe("local economy charts", () => {
  it("reads mapped employee counts and preserves missing sector years", () => {
    const effectifs: ICollectiviteEffectifsSalaries = {
      lastModified: "2026-05-29",
      source: "Urssaf",
      effectifsSalaries: {
        "2025": [
          { effectif: 20, grandSecteurActivite: "Commerce" },
          { effectif: 30, grandSecteurActivite: "Industrie" },
        ],
        "2024": [{ effectif: 15, grandSecteurActivite: "Commerce" }],
      },
    };

    render(<CollectiviteEconomieLocaleSection effectifs={effectifs} />);

    const { data } = renderLineChart.mock.calls[0][0];
    expect(data.labels).toEqual(["2024", "2025"]);
    expect(data.datasets.map(({ label, data }) => ({ label, data }))).toEqual([
      { label: "Commerce", data: [15, 20] },
      { label: "Industrie", data: [null, 30] },
    ]);
  });

  it("pairs monthly openings and closures chronologically without stacking or changing the response", () => {
    const fluxEtablissements: ICollectiviteFluxOuvertureEtablissements = {
      lastModified: "2026-09-08",
      source: "Insee",
      fluxEtablissements: [
        { mois: "2026-02", ouvertures: 8, fermetures: 0 },
        { mois: "2025-12", ouvertures: 5, fermetures: 12 },
        { mois: "2026-01", ouvertures: 10, fermetures: 4 },
      ],
    };

    render(
      <CollectiviteFluxEtablissementsSection
        fluxEtablissements={fluxEtablissements}
      />
    );

    const { data, scales } = renderBarChart.mock.calls[0][0];
    expect(data.labels).toEqual([
      "décembre 2025",
      "janvier 2026",
      "février 2026",
    ]);
    expect(data.datasets).toEqual([
      {
        label: "Ouvertures",
        backgroundColor: "#000091",
        data: [5, 10, 8],
      },
      {
        label: "Fermetures",
        backgroundColor: "#e60049",
        data: [12, 4, 0],
      },
    ]);
    expect(scales).toMatchObject({
      x: { stacked: false },
      y: { stacked: false, beginAtZero: true },
    });
    expect(
      fluxEtablissements.fluxEtablissements.map(({ mois }) => mois)
    ).toEqual(["2026-02", "2025-12", "2026-01"]);
  });

  it("shows an empty state when no employee counts are available", () => {
    render(
      <CollectiviteEconomieLocaleSection
        effectifs={{
          lastModified: "2026-05-29",
          source: "Urssaf",
          effectifsSalaries: {},
        }}
      />
    );

    expect(screen.getByText(/Aucune donnée d’effectifs salariés/)).toBeTruthy();
    expect(renderLineChart).not.toHaveBeenCalled();
  });

  it("shows an empty state when no establishment flows are available", () => {
    render(
      <CollectiviteFluxEtablissementsSection
        fluxEtablissements={{
          lastModified: "2026-09-08",
          source: "Insee",
          fluxEtablissements: [],
        }}
      />
    );

    expect(
      screen.getByText(/Aucune donnée d’ouvertures et de fermetures/)
    ).toBeTruthy();
    expect(renderBarChart).not.toHaveBeenCalled();
  });
});
