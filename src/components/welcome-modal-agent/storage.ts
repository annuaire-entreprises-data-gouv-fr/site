import { useStorage } from "#/hooks/use-storage";
import {
  DATA_ACCESS_REMINDER_COOKIE_MAX_AGE_SECONDS,
  DATA_ACCESS_REMINDER_MODAL_ID,
  INITIAL_WELCOME_MODAL_ID,
} from "./constants";

export const useHasSeenInitialWelcomeModal = () =>
  useStorage("local", INITIAL_WELCOME_MODAL_ID, false);

export const useHasSeenDataAccessReminderModal = () =>
  useStorage("cookie", DATA_ACCESS_REMINDER_MODAL_ID, false, {
    maxAge: DATA_ACCESS_REMINDER_COOKIE_MAX_AGE_SECONDS,
  });
