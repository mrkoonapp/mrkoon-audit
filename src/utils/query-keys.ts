// ----------------------------------------------------------------------
// Query Keys Factory
// Centralized query key management for TanStack Query
// ----------------------------------------------------------------------

/**
 * Query keys factory
 * Provides consistent and type-safe query keys for TanStack Query
 */
export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
  },

  // General
  general: {
    countries: ['general', 'countries'] as const,
  },
} as const;

// ----------------------------------------------------------------------

/**
 * Helper function to invalidate all queries related to a specific entity
 */
export const invalidateEntityQueries = {
  auth: () => queryKeys.auth.all,
} as const;
