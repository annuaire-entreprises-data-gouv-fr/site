'use client';

import { isLoggedIn } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { useEffect } from 'react';

function hasRefreshToken() {
  if (typeof window === 'undefined') {
    return false;
  }

  return document.cookie
    .split('; ')
    .some((cookie) => cookie.startsWith('has-refresh-token='));
}

function deleteHasRefreshToken() {
  if (typeof window === 'undefined') {
    return;
  }

  document.cookie = 'has-refresh-token=false;max-age=-1';
}

const refreshSession = async () => {
  try {
    const response = await fetch('/api/auth/agent-connect/refresh', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      deleteHasRefreshToken();
      throw new Error(`Failed to refresh session: ${response.statusText}`);
    }

    await response.json();
  } catch (err) {
    console.error(err);
  }
};

const RefreshSession = ({ session }: { session: ISession | null }) => {
  const loggedIn = isLoggedIn(session);

  useEffect(() => {
    if (!loggedIn && hasRefreshToken()) {
      refreshSession();
    }
  }, [loggedIn]);

  return null;
};

export default RefreshSession;
