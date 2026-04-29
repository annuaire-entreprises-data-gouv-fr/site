"use client";

import type React from "react";

export const ReloadButton: React.FC = () => (
  <a
    href={window.location.href}
    onClick={(e) => {
      e.preventDefault();
      window.location.reload();
    }}
  >
    cliquez-ici pour recharger la page et ré-essayer
  </a>
);
