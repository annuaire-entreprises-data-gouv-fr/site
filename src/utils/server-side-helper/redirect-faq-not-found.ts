import { redirect } from "@tanstack/react-router";
import { Exception } from "#/models/exceptions";
import { logWarningInSentry } from "#/utils/sentry";

export const redirectFAQPageNotFound = (slug: string) => {
  logWarningInSentry(
    new Exception({
      name: "FAQPageNotFound",
      context: { slug },
    })
  );
  redirect({ to: "/not-found", throw: true });
};
