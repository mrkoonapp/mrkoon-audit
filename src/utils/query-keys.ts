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

  // Audit
  audit: {
    all: ['audit'] as const,
    home: {
      kpis: (filters: any) => [...queryKeys.audit.all, 'home', 'kpis', filters] as const,
      transactionsChart: (filters: any) =>
        [...queryKeys.audit.all, 'home', 'transactionsChart', filters] as const,
      transactionTotals: (filters: any) =>
        [...queryKeys.audit.all, 'home', 'transactionTotals', filters] as const,
      topSellers: (filters: any) =>
        [...queryKeys.audit.all, 'home', 'topSellers', filters] as const,
      topCategories: (filters: any) =>
        [...queryKeys.audit.all, 'home', 'topCategories', filters] as const,
      topTags: (filters: any) => [...queryKeys.audit.all, 'home', 'topTags', filters] as const,
      successRate: (filters: any) =>
        [...queryKeys.audit.all, 'home', 'successRate', filters] as const,
      compare: (filters: any) =>
        [...queryKeys.audit.all, 'home', 'compare', filters] as const,
    },
    auctions: {
      kpis: (filters: any) => [...queryKeys.audit.all, 'auctions', 'kpis', filters] as const,
      byCategory: (filters: any) =>
        [...queryKeys.audit.all, 'auctions', 'byCategory', filters] as const,
      participatedClients: (filters: any) =>
        [...queryKeys.audit.all, 'auctions', 'participatedClients', filters] as const,
      list: (filters: any) => [...queryKeys.audit.all, 'auctions', 'list', filters] as const,
    },
    inspections: {
      kpis: (filters: any) => [...queryKeys.audit.all, 'inspections', 'kpis', filters] as const,
      byCategory: (filters: any) =>
        [...queryKeys.audit.all, 'inspections', 'byCategory', filters] as const,
      byPaymentMethod: (filters: any) =>
        [...queryKeys.audit.all, 'inspections', 'byPaymentMethod', filters] as const,
      list: (filters: any) => [...queryKeys.audit.all, 'inspections', 'list', filters] as const,
      perAuction: (filters: any) =>
        [...queryKeys.audit.all, 'inspections', 'perAuction', filters] as const,
    },
    sales: {
      kpis: (filters: any) => [...queryKeys.audit.all, 'sales', 'kpis', filters] as const,
      merchantUpdates: (filters: any) =>
        [...queryKeys.audit.all, 'sales', 'merchantUpdates', filters] as const,
      newMerchants: (filters: any) =>
        [...queryKeys.audit.all, 'sales', 'newMerchants', filters] as const,
      topMerchants: (filters: any) =>
        [...queryKeys.audit.all, 'sales', 'topMerchants', filters] as const,
      topSuccess: (filters: any) =>
        [...queryKeys.audit.all, 'sales', 'topSuccess', filters] as const,
    },
    operations: {
      kpis: (filters: any) => [...queryKeys.audit.all, 'operations', 'kpis', filters] as const,
    },
    onboarding: {
      kpis: (filters: any) => [...queryKeys.audit.all, 'onboarding', 'kpis', filters] as const,
    },
  },
} as const;

// ----------------------------------------------------------------------

/**
 * Helper function to invalidate all queries related to a specific entity
 */
export const invalidateEntityQueries = {
  auth: () => queryKeys.auth.all,
} as const;
