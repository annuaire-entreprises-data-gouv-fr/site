import { getProtectedSirenList } from "#models/protected-siren";

export async function GET() {
  const protectedSirenList = await getProtectedSirenList();

  return new Response(protectedSirenList.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
