import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Modal } from ".";

vi.mock("@tanstack/react-router", () => ({
  ClientOnly: ({ children }: PropsWithChildren) => children,
}));

const onClose = vi.fn();

function renderModal() {
  const { container } = render(
    <Modal isVisible modalId="test-modal" onClose={onClose}>
      <input aria-label="Champ" />
    </Modal>
  );
  return container.querySelector<HTMLElement>("[role=dialog]")
    ?.parentElement as HTMLElement;
}

afterEach(() => {
  cleanup();
  onClose.mockReset();
});

describe("Modal keyboard dismissal", () => {
  it.each(["Enter", " "])(
    "does not close when %j is pressed inside the modal",
    (key) => {
      renderModal();
      fireEvent.keyDown(screen.getByRole("textbox", { name: "Champ" }), {
        key,
      });

      expect(onClose).not.toHaveBeenCalled();
    }
  );

  it.each(["Enter", " "])("closes when %j is pressed on the overlay", (key) => {
    const overlay = renderModal();
    fireEvent.keyDown(overlay, { key });

    expect(onClose).toHaveBeenCalledOnce();
  });
});
