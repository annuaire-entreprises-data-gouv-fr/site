import { useState } from 'react';

function isStorageAvailable(type: 'session' | 'local') {
  const test = 'test';
  const store =
    type === 'session' ? window.sessionStorage : window.localStorage;

  if (typeof window === 'undefined') {
    return false;
  }

  try {
    store.setItem(test, test);
    store.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

export const useStorage = (
  type: 'session' | 'local',
  key: string,
  initialValue: any
) => {
  const storageAvailable = isStorageAvailable(type);

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (!storageAvailable) {
      return initialValue;
    }

    try {
      const store =
        type === 'session' ? window.sessionStorage : window.localStorage;
      // Get from local storage by key
      const item = store.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  if (!storageAvailable) {
    return [storedValue, () => {}];
  }

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: any) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        const store =
          type === 'session' ? window.sessionStorage : window.localStorage;
        store.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};
