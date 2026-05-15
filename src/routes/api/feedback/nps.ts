import { createFileRoute, redirect } from "@tanstack/react-router";
import { logInGrist } from "#/clients/external-tooling/grist";
import { Exception } from "#/models/exceptions";
import logErrorInSentry from "#/utils/sentry";

const logAllEvents = async (request: Request) => {
  try {
    const formData = await request.formData();
    const today = new Date();
    const NA = "Non renseigné";
    const visitorType = formData.get("radio-set-visitor-type") || NA;
    const mood = formData.get("radio-set-mood");
    const uuid = formData.get("uuid");
    const origin = formData.get("radio-set-visitor-origin") || NA;
    const text = formData.get("textarea") || null;
    const email = formData.get("email") || NA;

    logInGrist("nps-feedbacks", [
      {
        visitorType,
        mood,
        text,
        email,
        origin,
        date: today.toISOString().split("T")[0],
        uuid,
      },
    ]);
  } catch (e) {
    logErrorInSentry(
      new Exception({
        name: "NPSFormSubmissionException",
        cause: e,
      })
    );
  }
};

export const Route = createFileRoute("/api/feedback/nps")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204 }),
      POST: async ({ request }) => {
        logAllEvents(request);

        throw redirect({ to: "/formulaire/merci" });
      },
    },
  },
});
