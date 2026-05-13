import { createFileRoute } from "@tanstack/react-router";
import { getProtectedSirenList } from "#/models/protected-siren";

export const Route = createFileRoute("/api/protected-siren")({
  server: {
    handlers: {
      GET: async () => {
        const protectedSirenList = await getProtectedSirenList();

        return new Response(protectedSirenList.join("\n"), {
          status: 200,
          headers: {
            "Content-Type": "text/plain",
          },
        });
      },
    },
  },
});
