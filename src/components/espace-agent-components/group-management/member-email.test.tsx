import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemberEmail } from "./member-email";

afterEach(cleanup);

describe("a group member's email", () => {
  it("tells who added the member to the group", () => {
    render(
      <MemberEmail
        user={{
          email: "membre@example.fr",
          added_by_email: "admin@example.fr",
        }}
      />
    );

    const tooltip = screen.getByRole("tooltip", { hidden: true });
    expect(tooltip.textContent).toBe("Ajouté par admin@example.fr");
    expect(
      screen.getByText("membre@example.fr").getAttribute("aria-describedby")
    ).toBe(tooltip.id);
  });

  it("shows the email alone when who added the member is unknown", () => {
    const { container } = render(
      <MemberEmail
        user={{ email: "membre@example.fr", added_by_email: null }}
      />
    );

    expect(container.textContent).toBe("membre@example.fr");
    expect(screen.queryByRole("tooltip", { hidden: true })).toBeNull();
  });
});
