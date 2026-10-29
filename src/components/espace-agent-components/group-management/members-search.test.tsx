import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import routes from "#/clients/routes";
import { MembersSearch } from "./members-search";

const onSearchChange = vi.fn();

function renderSearch(search = "") {
  render(
    <MembersSearch
      groupId={1}
      onSearchChange={onSearchChange}
      search={search}
    />
  );
  return screen.getByRole<HTMLInputElement>("searchbox", {
    name: /Rechercher un membre/,
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  onSearchChange.mockReset();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("searching group members", () => {
  it("searches the trimmed value once the user stops typing", () => {
    const input = renderSearch();
    fireEvent.change(input, { target: { value: "dup" } });
    act(() => vi.advanceTimersByTime(200));
    fireEvent.change(input, { target: { value: " dupont " } });
    act(() => vi.advanceTimersByTime(299));

    expect(onSearchChange).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));

    expect(onSearchChange).toHaveBeenCalledTimes(1);
    expect(onSearchChange).toHaveBeenCalledWith("dupont");
  });

  it("starts from the current search and clears it", () => {
    const input = renderSearch("dupont");

    expect(input.value).toBe("dupont");
    act(() => vi.runAllTimers());
    expect(onSearchChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "" } });
    act(() => vi.runAllTimers());

    expect(onSearchChange).toHaveBeenCalledWith("");
  });
});

describe("roles.data group route", () => {
  it("only sends the search when there is one, encoded", () => {
    expect(routes.rolesData.groups.getGroup(3, 2, 50)).toBe(
      "/resource-server/groups/3?usersPage=2&usersSize=50"
    );
    expect(routes.rolesData.groups.getGroup(3, 1, 50, "jean+dupont@")).toBe(
      "/resource-server/groups/3?usersPage=1&usersSize=50&usersSearch=jean%2Bdupont%40"
    );
  });
});
