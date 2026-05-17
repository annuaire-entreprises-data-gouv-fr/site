import path from "node:path";
import {
  type APIRequestContext,
  type BrowserContext,
  test as base,
  type Locator,
  type Page,
  expect as pwExpect,
  type TestInfo,
} from "@playwright/test";

import {
  DATA_ACCESS_REMINDER_MODAL_ID,
  INITIAL_WELCOME_MODAL_ID,
} from "../../src/components/welcome-modal-agent/constants";

type TestCallback = () => void | Promise<void>;
type RouteBody = Record<string, unknown> | unknown[];

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

const expect = Object.assign((actual: unknown) => {
  const matcher = pwExpect(actual) as any;
  matcher.includes = (expected: unknown) =>
    pwExpect(String(actual)).toContain(String(expected));
  matcher.to = matcher.to ?? {};
  matcher.to.eq = (expected: unknown) => pwExpect(actual).toBe(expected);
  matcher.to.not = matcher.to.not ?? {};
  matcher.to.not.equal = (expected: unknown) =>
    pwExpect(actual).not.toBe(expected);
  return matcher;
}, pwExpect);

class ChainValue<T> {
  constructor(private readonly getValue: () => Promise<T>) {}

  should(assertion: string | ((value: T) => void), expected?: unknown) {
    cy.enqueue(async () => {
      const value = await this.getValue();
      if (typeof assertion === "function") {
        assertion(value);
        return;
      }
      if (assertion === "include") {
        await pwExpect
          .poll(async () => String(await this.getValue()))
          .toContain(String(expected));
        return;
      }
      if (assertion === "not.include") {
        await pwExpect
          .poll(async () => String(await this.getValue()))
          .not.toContain(String(expected));
        return;
      }
      throw new Error(`Unsupported value assertion: ${assertion}`);
    });
    return this;
  }
}

class Chain {
  private readonly autoCheck?: { cancelled: boolean };

  constructor(
    private readonly locator: Locator,
    options: { autoVisible?: boolean } = {}
  ) {
    if (options.autoVisible) {
      this.autoCheck = { cancelled: false };
      cy.enqueue(async () => {
        if (!this.autoCheck?.cancelled) {
          await pwExpect(this.locator.first()).toBeVisible();
        }
      });
    }
  }

  private cancelAutoCheck() {
    if (this.autoCheck) {
      this.autoCheck.cancelled = true;
    }
  }

  click(options?: { force?: boolean }) {
    this.cancelAutoCheck();
    cy.enqueue(() => this.locator.first().click({ force: options?.force }));
    return this;
  }

  type(value: string) {
    this.cancelAutoCheck();
    cy.enqueue(() => this.locator.first().fill(value));
    return this;
  }

  clear() {
    this.cancelAutoCheck();
    cy.enqueue(() => this.locator.first().clear());
    return this;
  }

  should(assertion: string, ...expected: unknown[]) {
    this.cancelAutoCheck();
    cy.enqueue(async () => {
      const locator = this.locator;
      if (assertion === "be.visible") {
        await pwExpect(locator.first()).toBeVisible();
        return;
      }
      if (assertion === "not.be.visible") {
        await pwExpect(locator.first()).not.toBeVisible();
        return;
      }
      if (assertion === "exist") {
        pwExpect(await locator.count()).toBeGreaterThan(0);
        return;
      }
      if (assertion === "not.exist") {
        await pwExpect(locator).toHaveCount(0);
        return;
      }
      if (assertion === "have.length") {
        await pwExpect(locator).toHaveCount(Number(expected[0]));
        return;
      }
      if (assertion === "have.length.of.at.least") {
        pwExpect(await locator.count()).toBeGreaterThanOrEqual(
          Number(expected[0])
        );
        return;
      }
      if (assertion === "have.attr") {
        const [name, value] = expected as [string, string];
        await pwExpect(locator.first()).toHaveAttribute(name, value);
        return;
      }
      if (assertion === "have.value") {
        await pwExpect(locator.first()).toHaveValue(String(expected[0]));
        return;
      }
      throw new Error(`Unsupported locator assertion: ${assertion}`);
    });
    return this;
  }

  findAllByRole(role: Parameters<Locator["getByRole"]>[0]) {
    return new Chain(this.locator.getByRole(role));
  }

  findByRole(
    role: Parameters<Locator["getByRole"]>[0],
    options?: Parameters<Locator["getByRole"]>[1]
  ) {
    return new Chain(this.locator.getByRole(role, options).first(), {
      autoVisible: true,
    });
  }

  findByText(text: string | RegExp) {
    return new Chain(this.locator.getByText(text).first(), {
      autoVisible: true,
    });
  }

  findAllByText(text: string | RegExp) {
    return new Chain(this.locator.getByText(text));
  }

  contains(text: string | RegExp) {
    return new Chain(this.locator.getByText(text).first(), {
      autoVisible: true,
    });
  }

  get(selector: string) {
    this.cancelAutoCheck();
    return new Chain(this.locator.locator(selector));
  }

  filter(selector: string) {
    const match = selector.match(/^:contains\("(.+)"\)$/);
    if (!match) {
      throw new Error(`Unsupported filter selector: ${selector}`);
    }
    return new Chain(this.locator.filter({ hasText: match[1] }));
  }

  first() {
    this.cancelAutoCheck();
    return new Chain(this.locator.first());
  }

  last() {
    this.cancelAutoCheck();
    return new Chain(this.locator.last());
  }

  within(callback: TestCallback) {
    this.cancelAutoCheck();
    const previousScope = cy.scope;
    cy.scope = this.locator;
    callback();
    cy.scope = previousScope;
    return this;
  }

  // biome-ignore lint/suspicious/noThenProperty: Keeps the migrated Cypress chain API working on Playwright.
  then(callback: (locator: Locator) => void | Promise<void>) {
    this.cancelAutoCheck();
    cy.enqueue(() => callback(this.locator));
    return this;
  }

  each(callback: (item: { prop: (name: string) => string }) => void) {
    this.cancelAutoCheck();
    cy.enqueue(async () => {
      const count = await this.locator.count();
      for (let index = 0; index < count; index += 1) {
        const locator = this.locator.nth(index);
        const href = await locator.getAttribute("href");
        callback({
          prop: (name: string) => {
            if (name !== "href") {
              throw new Error(`Unsupported prop: ${name}`);
            }
            return href ? new URL(href, BASE_URL).toString() : "";
          },
        });
      }
    });
    return this;
  }

  async textContent() {
    return this.locator.first().textContent();
  }
}

class RequestChain {
  private response?: { status: number; body: unknown };

  constructor(
    private readonly execute: () => Promise<{ status: number; body: unknown }>
  ) {
    cy.enqueue(async () => {
      this.response = await execute();
    });
  }

  // biome-ignore lint/suspicious/noThenProperty: Keeps cy.request(...).then(...) compatible during migration.
  then(callback: (response: { status: number; body: unknown }) => void) {
    cy.enqueue(async () => callback(this.response ?? (await this.execute())));
    return this;
  }
}

class Cy {
  page!: Page;
  context!: BrowserContext;
  apiRequest!: APIRequestContext;
  testInfo!: TestInfo;
  scope: Page | Locator = undefined as unknown as Page;
  private queue = Promise.resolve();

  reset(
    page: Page,
    context: BrowserContext,
    request: APIRequestContext,
    testInfo: TestInfo
  ) {
    this.page = page;
    this.context = context;
    this.apiRequest = request;
    this.testInfo = testInfo;
    this.scope = page;
    this.queue = Promise.resolve();
    (globalThis as any).window = {
      location: new URL(BASE_URL),
    };
  }

  enqueue(action: () => Promise<unknown> | unknown) {
    this.queue = this.queue.then(action).then(() => undefined);
  }

  async flush() {
    await this.queue;
  }

  visit(path: string) {
    this.enqueue(() => this.page.goto(path));
    return {
      // biome-ignore lint/suspicious/noThenProperty: Keeps cy.visit(...).then(...) compatible during migration.
      then: (callback: TestCallback) => {
        this.enqueue(callback);
      },
    };
  }

  get(selector: string) {
    return new Chain(this.scope.locator(selector));
  }

  contains(selectorOrText: string | RegExp, text?: string | RegExp) {
    if (text === undefined) {
      return new Chain(this.scope.getByText(selectorOrText).first(), {
        autoVisible: true,
      });
    }
    return new Chain(
      this.scope
        .locator(String(selectorOrText))
        .filter({ hasText: text })
        .first(),
      { autoVisible: true }
    );
  }

  findByRole(
    role: Parameters<Locator["getByRole"]>[0],
    options?: Parameters<Locator["getByRole"]>[1]
  ) {
    return new Chain(this.scope.getByRole(role, options).first(), {
      autoVisible: true,
    });
  }

  findAllByRole(role: Parameters<Locator["getByRole"]>[0]) {
    return new Chain(this.scope.getByRole(role));
  }

  findByText(text: string | RegExp) {
    return new Chain(this.scope.getByText(text).first(), { autoVisible: true });
  }

  findAllByText(text: string | RegExp) {
    return new Chain(this.scope.getByText(text));
  }

  wait(value: number | string) {
    if (typeof value === "number") {
      this.enqueue(() => this.page.waitForTimeout(value));
    }
  }

  url() {
    return new ChainValue(() => Promise.resolve(this.page.url()));
  }

  location() {
    return new ChainValue(() => Promise.resolve(new URL(this.page.url())));
  }

  request(pathOrOptions: string | { url: string; failOnStatusCode?: boolean }) {
    const url =
      typeof pathOrOptions === "string" ? pathOrOptions : pathOrOptions.url;
    return new RequestChain(() =>
      this.apiRequest.get(url).then(async (response) => ({
        status: response.status(),
        body: await response.text(),
      }))
    );
  }

  intercept(method: string, url: string, body: RouteBody) {
    this.enqueue(() =>
      this.page.route(url, async (route) => {
        if (route.request().method() !== method) {
          await route.fallback();
          return;
        }
        if (
          typeof body === "object" &&
          body !== null &&
          "fixture" in body &&
          typeof body.fixture === "string"
        ) {
          const fixturePath = body.fixture.replace(/^(\.\.\/)?fixtures\//, "");
          await route.fulfill({
            path: path.join(process.cwd(), "cypress", "fixtures", fixturePath),
          });
          return;
        }
        await route.fulfill({ json: body });
      })
    );
    return {
      as: () => undefined,
    };
  }

  login(email = "user@yopmail.com") {
    this.enqueue(async () => {
      await this.apiRequest.post("/api/test/session", {
        data: { email },
      });
      await this.context.addCookies([
        {
          name: DATA_ACCESS_REMINDER_MODAL_ID,
          value: "true",
          url: BASE_URL,
        },
      ]);
      await this.page.addInitScript(
        ([key]) => window.localStorage.setItem(key, "true"),
        [INITIAL_WELCOME_MODAL_ID]
      );
    });
  }

  clearCookies() {
    this.enqueue(() => this.context.clearCookies());
  }

  origin(_origin: string, callback: TestCallback) {
    callback();
  }
}

export const cy = new Cy();

const wrap =
  (runner: typeof base) => (title: string, callback: TestCallback) => {
    runner(title, async ({ page, context, request }, testInfo) => {
      cy.reset(page, context, request, testInfo);
      await callback();
      await cy.flush();
    });
  };

export const test = Object.assign(wrap(base), {
  describe: base.describe,
  beforeEach: (callback: TestCallback) => {
    base.beforeEach(async ({ page, context, request }, testInfo) => {
      cy.reset(page, context, request, testInfo);
      await callback();
      await cy.flush();
    });
  },
});

export { expect };
