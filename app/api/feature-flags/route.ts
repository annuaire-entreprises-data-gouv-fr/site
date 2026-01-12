import { Exception } from "#models/exceptions";
import { getFeatureFlagsList } from "#models/feature-flags";
import logErrorInSentry from "#utils/sentry";

export async function GET() {
  try {
    const featureFlags = await getFeatureFlagsList();
    return new Response(JSON.stringify({ featureFlags }), { status: 200 });
  } catch (error) {
    logErrorInSentry(
      new Exception({ name: "Feature Flags API", cause: error })
    );

    return new Response(
      JSON.stringify({ message: "server error", status: 500 }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
