import { headers } from "next/headers";
import type { AppRouterProps } from "#utils/server-side-helper/extract-params";
import { LoggerContext, runWithLoggerContext } from "./logger-context";

const getSearchParams = async (props: Partial<AppRouterProps>) => {
  const resolvedSearchParams = (await props.searchParams) || {};
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === "string") {
      searchParams.set(key, value);
      continue;
    }

    const firstValue = value?.at(0);
    if (firstValue) {
      searchParams.set(key, firstValue);
    }
  }

  return searchParams;
};

export const runPageWithLogger = async <T>(
  props: Partial<AppRouterProps>,
  page: (loggerContext: LoggerContext) => T | Promise<T>,
  pathname: string
): Promise<T> => {
  const headersList = await headers();
  const loggerContext = new LoggerContext({
    event: {
      type: "page",
      category: ["page"],
      action: "get-page",
    },
    url: {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`,
      method: "GET",
      params: await getSearchParams(props),
    },
    request: {
      method: "GET",
      requestId: headersList.get("x-request-id"),
    },
  });

  return runWithLoggerContext(loggerContext, () => page(loggerContext));
};
