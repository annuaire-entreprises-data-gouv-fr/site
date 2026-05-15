import { createFileRoute } from "@tanstack/react-router";
import type { IAgentScope } from "#/models/authentication/agent/scopes/constants";
import type { ISession } from "#/models/authentication/user/session";
import { getCurrentSession } from "#/utils/session/index.server";
import { defaultHeadersMiddleware } from "../-middlewares";

export const Route = createFileRoute("/api/test/session")({
  server: {
    middleware: [defaultHeadersMiddleware()],
    handlers: {
      POST: async ({ request }) => {
        if (
          import.meta.env.PROD ||
          process.env.NODE_ENV === "production" ||
          process.env.VITE_END2END_MOCKING !== "enabled"
        ) {
          return new Response(null, { status: 404 });
        }

        const { comptesAgents } = await import(
          "../../../../cypress/mocks/comptes-agents"
        );
        const body = (await request.json().catch(() => ({}))) as {
          email?: string;
        };
        const email = body.email || "user@yopmail.com";
        const user = comptesAgents.find((agent) => agent.email === email);

        if (!user) {
          return Response.json(
            { message: `User ${email} not found in comptesAgents` },
            { status: 404 }
          );
        }

        const session = await getCurrentSession();
        const sessionData = {
          user: {
            idpId: "123456789",
            proConnectSub: "123456789",
            domain: "yopmail.com",
            siret: "12345678912345",
            familyName: "John Doe",
            firstName: "John Doe",
            fullName: "John Doe",
            email: user.email,
            scopes: user.scopes.split(" ") as IAgentScope[],
            groupsScopes: {},
            userType: "Super-agent connecté",
            isSuperAgent: true,
          },
        } satisfies ISession;

        await session.update(sessionData);

        return Response.json({ ok: true });
      },
    },
  },
});
