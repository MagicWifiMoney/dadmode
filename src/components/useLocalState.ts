'use client';

import { useEffect, useState } from 'react';

/**
 * State that persists to localStorage. SSR-safe: it renders `initial` on the
 * server and the first client paint (so there's no hydration mismatch), then
 * hydrates from storage on mount. `hydrated` lets callers avoid writing the
 * default back over real saved data before the read has happened.
 */
export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, [key]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}
