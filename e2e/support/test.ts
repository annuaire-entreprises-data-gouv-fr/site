import path from "node:path";
import {
  type BrowserContext,
  type Page,
  expect as playwrightExpect,
} from "@playwright/test";

import {
  DATA_ACCESS_REMINDER_MODAL_ID,
  INITIAL_WELCOME_MODAL_ID,
} from "../../src/components/welcome-modal-agent/constants";

export { expect, test } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

export async function goto(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {
    // Some routes keep background requests alive; assertions below still use
    // Playwright auto-waiting for the actual UI state.
  });
  await playwrightExpect(page.locator("body")).toBeVisible();
}

export async function login(
  page: Page,
  context: BrowserContext,
  email = "user@yopmail.com"
) {
  await page.request.post("/api/test/session", {
    data: { email },
  });
  await context.addCookies([
    {
      name: DATA_ACCESS_REMINDER_MODAL_ID,
      value: "true",
      url: BASE_URL,
    },
  ]);
  await page.addInitScript(
    ([key]) => window.localStorage.setItem(key, "true"),
    [INITIAL_WELCOME_MODAL_ID]
  );
}

export async function mockRoute(
  page: Page,
  url: string,
  bodyOrFixture: Record<string, unknown> | unknown[] | { fixture: string }
) {
  await page.route(url, async (route) => {
    if (
      "fixture" in bodyOrFixture &&
      typeof bodyOrFixture.fixture === "string"
    ) {
      const fixturePath = bodyOrFixture.fixture.replace(
        /^(\.\.\/)?fixtures\//,
        ""
      );
      await route.fulfill({
        path: path.join(
          process.cwd(),
          "src",
          "e2e-mock",
          "fixtures",
          fixturePath
        ),
      });
      return;
    }
    await route.fulfill({ json: bodyOrFixture });
  });
}

export function rowByText(page: Page, rootSelector: string, text: string) {
  return page.locator(rootSelector).getByRole("row").filter({ hasText: text });
}

export function lastCellByRowText(
  page: Page,
  rootSelector: string,
  text: string
) {
  return rowByText(page, rootSelector, text).getByRole("cell").last();
}

export function firstCellByText(
  page: Page,
  rootSelector: string,
  text: string
) {
  return page
    .locator(rootSelector)
    .getByRole("cell")
    .filter({ hasText: text })
    .first();
}
