import { Exception } from "#models/exceptions";
import { type FeatureFlag, isFeatureFlagEnabled } from "#models/feature-flags";
import logErrorInSentry from "#utils/sentry";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featureFlag = searchParams.get("featureFlag");

  if (!featureFlag) {
    return new Response("Feature flag is required", { status: 400 });
  }

  try {
    const isEnabled = await isFeatureFlagEnabled(featureFlag as FeatureFlag);
    return new Response(JSON.stringify({ isEnabled }), { status: 200 });
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
