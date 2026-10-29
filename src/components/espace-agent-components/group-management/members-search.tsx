import { useEffect, useState } from "react";

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Search the group members by email, as the user types
 */
export function MembersSearch({
  groupId,
  search,
  onSearchChange,
}: {
  groupId: number;
  search: string;
  onSearchChange: (search: string) => void;
}) {
  const [value, setValue] = useState(search);

  useEffect(() => {
    const newSearch = value.trim();
    if (newSearch === search) {
      return;
    }
    const timeout = setTimeout(
      () => onSearchChange(newSearch),
      SEARCH_DEBOUNCE_MS
    );
    return () => clearTimeout(timeout);
  }, [value, search, onSearchChange]);

  return (
    <div className="fr-input-group fr-mb-0" style={{ flex: "0 1 28rem" }}>
      <label className="fr-label" htmlFor={`group-members-search-${groupId}`}>
        Rechercher un membre
        <span className="fr-hint-text">Par adresse email</span>
      </label>
      <input
        autoComplete="off"
        className="fr-input"
        id={`group-members-search-${groupId}`}
        onChange={(e) => setValue(e.target.value)}
        placeholder="prenom.nom@exemple.fr"
        type="search"
        value={value}
      />
    </div>
  );
}
