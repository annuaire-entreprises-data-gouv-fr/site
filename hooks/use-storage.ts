import { useState } from "react";
import {
  getCookieBrowser,
  type IBrowserCookieOptions,
  setCookieBrowser,
} from "#utils/cookies/browser-cookies";

type StorageType = "session" | "local" | "cookie";

const isBrowser = () => typeof window !== "undefined";

function isStorageAvailable(type: StorageType) {
  const test = "test";

  if (!isBrowser()) {
    return false;
  }

  if (type === "cookie") {
    return navigator.cookieEnabled;
  }

  try {
    const store = getStore(type);
    store.setItem(test, test);
    store.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

const getStore = (type: "session" | "local") =>
  type === "session" ? window.sessionStorage : window.localStorage;

const getStorageValue = <T>(
  type: StorageType,
  key: string,
  initialValue: T,
  storageAvailable: boolean
) => {
  if (!storageAvailable) {
    return initialValue;
  }

  try {
    const item =
      type === "cookie" ? getCookieBrowser(key) : getStore(type).getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(error);
    return initialValue;
  }
};

const setStorageValue = <T>(
  type: StorageType,
  key: string,
  value: T,
  cookieOptions?: IBrowserCookieOptions
) => {
  if (!isBrowser()) {
    return;
  }

  const serializedValue = JSON.stringify(value);

  if (type === "cookie") {
    setCookieBrowser(key, serializedValue, cookieOptions);
    return;
  }

  getStore(type).setItem(key, serializedValue);
};

export const useStorage = <T>(
  type: StorageType,
  key: string,
  initialValue: T,
  cookieOptions?: IBrowserCookieOptions
): [T, (value: unknown) => void] => {
  const storageAvailable = isStorageAvailable(type);

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() =>
    getStorageValue(type, key, initialValue, storageAvailable)
  );

  if (!storageAvailable) {
    return [storedValue, () => {}];
  }

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to the requested browser storage.
  const setValue = (value: unknown) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore as T);
      setStorageValue(type, key, valueToStore, cookieOptions);
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};
