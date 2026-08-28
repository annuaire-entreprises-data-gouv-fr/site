import { expect, goto, login, test } from "../support/test";

function getServerFunctionName(url: string): string | null {
  const pathname = new URL(url).pathname;
  if (!pathname.startsWith("/_serverFn/")) {
    return null;
  }

  const functionName = pathname.slice("/_serverFn/".length);
  try {
    // Development encodes metadata; production uses the function name.
    const metadata = JSON.parse(
      Buffer.from(functionName, "base64url").toString("utf8")
    );
    return metadata.export.replace("_createServerFn_handler", "");
  } catch {
    return functionName;
  }
}

test.describe("Fiche résumé DANONE", () => {
  test("Should display basic infos", async ({ page }) => {
    await goto(page, "/entreprise/danone-552032534");

    await expect(
      page.getByText(
        "Sa forme juridique est SA à conseil d'administration (s.a.i.)."
      )
    ).toBeVisible();
    await expect(
      page.getByText("Informations légales de DANONE").first()
    ).toBeVisible();
    await expect(
      page.getByText(
        "Son siège social est domicilié au 59-61 RUE LA FAYETTE 75009 PARIS."
      )
    ).toBeVisible();
    await expect(
      page.getByText("N° TVA Intracommunautaire").first()
    ).toBeVisible();
    await expect(page.getByText("FR27 552 032 534").first()).toBeVisible();
    await expect(page.getByText("N° EORI").first()).toBeVisible();
    await expect(page.getByText("FR123 456 789 0").first()).toBeVisible();
    await expect(page.getByText("Effectif salarié").first()).toBeVisible();
    await expect(
      page.getByText("1 000 à 1 999 salariés, en 2023").first()
    ).toBeVisible();
  });

  test("[LOGGED] Should display basic infos", async ({ page, context }) => {
    await login(page, context);
    await goto(page, "/entreprise/danone-552032534");

    await expect(page.getByText("Effectif salarié").first()).toBeVisible();
    await expect(
      page.getByText("1 000 à 1 999 salariés, en 2023").first()
    ).toBeVisible();
    await expect(
      page.getByText("Résumé pour les agents publics").first()
    ).toBeVisible();
    await expect(page.getByText("Documents juridiques").first()).toBeVisible();
    await expect(
      page.getByText("Consulter les Actes et les Statuts constitutifs")
    ).toBeVisible();
  });
});

test.describe("Shared entreprise layout", () => {
  test("Fetches the unite legale only once when switching tabs", async ({
    page,
  }) => {
    await goto(page, "/entreprise/danone-552032534");

    const uniteLegaleRequests: string[] = [];
    page.on("request", (request) => {
      const functionName = getServerFunctionName(request.url());
      if (
        functionName === "loadEntrepriseLayout" ||
        functionName === "getUniteLegaleFromSlugFn"
      ) {
        uniteLegaleRequests.push(functionName);
      }
    });

    await page.getByRole("link", { name: "Documents", exact: true }).click();

    await expect(page).toHaveURL(/\/documents\/552032534$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("DANONE");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://annuaire-entreprises.data.gouv.fr/documents/552032534"
    );
    expect(uniteLegaleRequests).toEqual(["loadEntrepriseLayout"]);
  });

  test("Refreshes company data and SEO on client navigation and back", async ({
    page,
  }) => {
    await goto(page, "/entreprise/danone-552032534");
    const companyTitle = page.getByRole("heading", { level: 1 });
    const canonical = page.locator('link[rel="canonical"]');
    await expect(companyTitle).toHaveText("DANONE");

    // Keep the layout matched instead of visiting the search page in between.
    await page.evaluate(() => {
      const router = window.__TSR_ROUTER__;
      if (!router) {
        throw new Error("TanStack Router is not initialized");
      }
      return router.navigate({
        to: "/entreprise/$slug",
        params: {
          slug: "la-poste-356000000",
        },
      });
    });

    await expect(page).toHaveURL(/\/entreprise\/la-poste-356000000$/);
    await expect(companyTitle).toHaveText("LA POSTE");
    await expect(
      page.getByRole("heading", {
        name: "Informations légales de LA POSTE",
        exact: true,
      })
    ).toBeVisible();
    await expect(canonical).toHaveAttribute(
      "href",
      "https://annuaire-entreprises.data.gouv.fr/entreprise/356000000"
    );

    await page.goBack();

    await expect(page).toHaveURL(/\/entreprise\/danone-552032534$/);
    await expect(companyTitle).toHaveText("DANONE");
    await expect(
      page.getByRole("heading", {
        name: "Informations légales de DANONE",
        exact: true,
      })
    ).toBeVisible();
    await expect(canonical).toHaveAttribute(
      "href",
      "https://annuaire-entreprises.data.gouv.fr/entreprise/552032534"
    );
  });

  test("Keeps the latest company when an older navigation finishes late", async ({
    page,
  }) => {
    await goto(page, "/entreprise/danone-552032534");
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    let markResponseHeld!: () => void;
    const responseHeld = new Promise<void>((resolve) => {
      markResponseHeld = resolve;
    });
    let releaseResponse!: () => void;
    const responseReleased = new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });
    await page.route("**/_serverFn/**", async (route) => {
      const request = route.request();
      const body = request.postData() || "";
      if (
        getServerFunctionName(request.url()) !== "loadEntrepriseLayout" ||
        !body.includes('"divers"') ||
        !body.includes('"552032534"')
      ) {
        await route.continue();
        return;
      }

      const response = await route.fetch();
      markResponseHeld();
      await responseReleased;
      // A cancelled fetch need not emit requestfinished; await the route instead.
      await route.fulfill({ response });
    });

    const staleNavigation = page.evaluate(() => {
      const router = window.__TSR_ROUTER__;
      if (!router) {
        throw new Error("TanStack Router is not initialized");
      }
      return router
        .navigate({ to: "/divers/$slug", params: { slug: "552032534" } })
        .catch((error: Error) => {
          if (error.name !== "AbortError") {
            throw error;
          }
        });
    });

    await responseHeld;
    try {
      await page.evaluate(() => {
        const router = window.__TSR_ROUTER__;
        if (!router) {
          throw new Error("TanStack Router is not initialized");
        }
        return router.navigate({
          to: "/entreprise/$slug",
          params: { slug: "la-poste-356000000" },
        });
      });
    } finally {
      releaseResponse();
      await page.unrouteAll({ behavior: "wait" });
    }
    await staleNavigation;

    await expect(page).toHaveURL(/\/entreprise\/la-poste-356000000$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "LA POSTE"
    );
    await expect(
      page.getByRole("heading", { name: "Informations légales de LA POSTE" })
    ).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://annuaire-entreprises.data.gouv.fr/entreprise/356000000"
    );
    expect(pageErrors).toEqual([]);
  });

  test("Returns 404 metadata and keeps the header for an invalid company", async ({
    page,
  }) => {
    const response = await page.goto("/entreprise/not-a-siren");

    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle("Page non trouvée");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow"
    );
    await expect(page.locator("header.fr-header")).toBeVisible();
  });
});

test.describe("Entreprises non-diffusibles", () => {
  test("Should be non diffusible", async ({ page }) => {
    await goto(page, "/entreprise/300025764");
    await expect(page.getByText("ne sont pas publiquement")).toHaveCount(1);
  });

  test("Should be diffusible", async ({ page }) => {
    await goto(page, "/entreprise/880878145");
    await expect(page.getByText("ne sont pas publiquement")).toHaveCount(0);
  });
});

test.describe("TVA number special cases", () => {
  test("TVA Non-assujettie", async ({ page }) => {
    await goto(page, "/entreprise/883010316");
    await expect(page.getByText("Pas de n° TVA valide").first()).toBeVisible();

    await goto(page, "/entreprise/423208180");
    await expect(page.getByText("Pas de n° TVA valide").first()).toBeVisible();
  });
});
