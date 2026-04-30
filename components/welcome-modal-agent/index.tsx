"use client";

import type React from "react";
import { DataAccessReminderModal } from "./data-access-reminder-modal";
import { InitialWelcomeModal } from "./initial-welcome-modal";

export const WelcomeModalAgent: React.FC = () => (
  <>
    <InitialWelcomeModal />
    <DataAccessReminderModal />
  </>
);
