import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="page-wrap px-4 pt-14 pb-8">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -top-24 -left-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">TanStack Start Base Template</p>
        <h1 className="display-title mb-5 max-w-3xl font-bold text-4xl text-[var(--sea-ink)] leading-[1.02] tracking-tight sm:text-6xl">
          Start simple, ship quickly.
        </h1>
        <p className="mb-8 max-w-2xl text-[var(--sea-ink-soft)] text-base sm:text-lg">
          This base starter intentionally keeps things light: two routes, clean
          structure, and the essentials you need to build from scratch.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 font-semibold text-[var(--lagoon-deep)] text-sm no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
            href="/about"
          >
            About This Starter
          </a>
          <a
            className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5 font-semibold text-[var(--sea-ink)] text-sm no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
            href="https://tanstack.com/router"
            rel="noopener noreferrer"
            target="_blank"
          >
            Router Guide
          </a>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [
            "Type-Safe Routing",
            "Routes and links stay in sync across every page.",
          ],
          [
            "Server Functions",
            "Call server code from your UI without creating API boilerplate.",
          ],
          [
            "Streaming by Default",
            "Ship progressively rendered responses for faster experiences.",
          ],
          [
            "Tailwind Native",
            "Design quickly with utility-first styling and reusable tokens.",
          ],
        ].map(([title, desc], index) => (
          <article
            className="island-shell feature-card rise-in rounded-2xl p-5"
            key={title}
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <h2 className="mb-2 font-semibold text-[var(--sea-ink)] text-base">
              {title}
            </h2>
            <p className="m-0 text-[var(--sea-ink-soft)] text-sm">{desc}</p>
          </article>
        ))}
      </section>

      <section className="island-shell mt-8 rounded-2xl p-6">
        <p className="island-kicker mb-2">Quick Start</p>
        <ul className="m-0 list-disc space-y-2 pl-5 text-[var(--sea-ink-soft)] text-sm">
          <li>
            Edit <code>src/routes/index.tsx</code> to customize the home page.
          </li>
          <li>
            Update <code>src/components/Header.tsx</code> and{" "}
            <code>src/components/Footer.tsx</code> for brand links.
          </li>
          <li>
            Add routes in <code>src/routes</code> and tweak visual tokens in{" "}
            <code>src/styles.css</code>.
          </li>
        </ul>
      </section>
    </main>
  );
}
