import { createAuthClient } from 'better-auth/react';

/**
 * Better Auth Client Instance for PizzaVibe
 * Handles social OAuth (Google), session management, and auth actions.
 */
export const authClient = createAuthClient({
  baseURL:
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
});

export default authClient;
