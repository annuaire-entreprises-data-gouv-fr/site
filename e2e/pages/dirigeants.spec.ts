import { expect, goto, login, test } from "../support/test";

test.describe("Dirigeants ESSOR ENERGIES (SOLARSUD)", () => {
  test("Should display dirigeants from INPI", async ({ page }) => {
    await goto(page, "/entreprise/487444697/dirigeants");

    await expect(
      page.getByText(
        "Cette entreprise possède 2 dirigeants enregistrés au Registre National des Entreprises (RNE) tenu par l’INPI."
      )
    ).toBeVisible();
    await expect(
      page.getByText("David, Jean-Claude POUYANNE, né(e) en octobre 1965")
    ).toBeVisible();
  });

  test("[LOGGED] Should display comparison between INPI and IG", async ({
    page,
    context,
  }) => {
    await login(page, context);
    await goto(page, "/entreprise/487444697/dirigeants");

    await expect(
      page.getByText(
        "Ces informations proviennent du RNE et sont issues d‘une comparaison entre les données issues de l’INPI et celles d’Infogreffe"
      )
    ).toBeVisible();
    await expect(
      page
        .getByText(
          "BCRH & ASSOCIES - SOCIETE A RESPONSABILITE LIMITEE A ASSOCIE UNIQUE"
        )
        .first()
    ).toBeVisible();
    await expect(
      page.getByText("David, Jean-Claude POUYANNE").first()
    ).toBeVisible();
  });
});

test.describe("Diffusion des dirigeants", () => {
  for (const { siren, protection } of [
    { siren: "908595879", protection: "legacy" },
    { siren: "990000010", protection: "new" },
  ]) {
    test(`Only the listed individual is masked under ${protection} protection`, async ({
      page,
    }) => {
      await goto(page, `/entreprise/${siren}/dirigeants`);
      const section = page.locator("#dirigeants-section");
      const president = section
        .getByRole("row")
        .filter({ hasText: /pr[ée]sidente/i });
      const masked = president.getByText(/identité protégée/i);
      await expect(masked).toBeVisible();
      await expect(president).not.toContainText(/Le Moine|Élodie|avril 1978/i);
      await expect(section).not.toContainText(/Élodie, Anne|avril 1978/i);
      await masked.hover();
      await expect(president.getByRole("tooltip")).toHaveText(
        "Ce dirigeant s’oppose à la diffusion de ses données personnelles."
      );
      await expect(
        section.getByRole("row").filter({ hasText: "DIRECTRICE" })
      ).toContainText("Élodie LE MOINE, né(e) en septembre 1983");
      await expect(
        section.getByRole("row").filter({ hasText: "ADMINISTRATEUR" })
      ).toContainText("HOLDING TEMOIN");
    });

    test(`Agents see the RNE identity under ${protection} protection`, async ({
      page,
      context,
    }) => {
      await login(page, context);
      await goto(page, `/entreprise/${siren}/dirigeants`);
      await expect(page.locator("#dirigeants-section-protected")).toContainText(
        "Élodie, Anne LE MOINE, né(e) en avril 1978"
      );
    });
  }

  test("A legacy record without a named director shows the RNE empty state", async ({
    page,
  }) => {
    await goto(page, "/entreprise/990000028/dirigeants");
    await expect(page.locator("#dirigeants-section")).toContainText(
      "n’y possède aucun dirigeant"
    );
  });

  test("An unavailable RNE does not expose search API directors of a protected company", async ({
    page,
  }) => {
    await goto(page, "/entreprise/990000036/dirigeants");
    const section = page.locator("#dirigeants-section");
    await expect(section).toContainText("ne fonctionne pas en ce moment");
    await expect(section).not.toContainText("CAMILLE RECHERCHE", {
      ignoreCase: true,
    });
  });

  test("Agents see only the available registry data during a protected RNE outage", async ({
    page,
    context,
  }) => {
    await login(page, context);
    await goto(page, "/entreprise/990000036/dirigeants");
    const section = page.locator("#dirigeants-section-protected");
    await expect(section).toContainText("BCRH & ASSOCIES");
    await expect(section).not.toContainText(
      /Camille RECHERCHE|fonctionne partiellement/i
    );
  });

  test("Agents see the RNE directors of a partially diffusible company", async ({
    page,
    context,
  }) => {
    await login(page, context);
    await goto(page, "/entreprise/990000044/dirigeants");
    await expect(page.locator("#dirigeants-section-protected")).toContainText(
      "Élodie, Anne LE MOINE"
    );
  });

  test("Partial diffusion keeps the public directors section private", async ({
    page,
  }) => {
    await goto(page, "/entreprise/990000044/dirigeants");
    await expect(
      page.getByRole("heading", { name: "Dirigeant(s) (données privées)" })
    ).toBeVisible();
    await expect(page.locator("#dirigeants-section")).toHaveCount(0);
  });
});
