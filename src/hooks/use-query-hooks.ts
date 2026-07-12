import { type AxiosError } from 'axios';
import {
  useQuery,
  useMutation,
  type QueryKey,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';

// ----------------------------------------------------------------------

/**
 * Type-safe wrapper for useQuery
 * Provides better error handling and type inference
 */
export function useApiQuery<TData = unknown, TError = AxiosError>(
  options: UseQueryOptions<TData, TError>
) {
  return useQuery<TData, TError>(options);
}

// ----------------------------------------------------------------------

/**
 * Type-safe wrapper for useMutation
 * Provides better error handling and type inference
 */
export function useApiMutation<
  TData = unknown,
  TError = AxiosError,
  TVariables = void,
  TContext = unknown,
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
  return useMutation<TData, TError, TVariables, TContext>(options);
}

// ----------------------------------------------------------------------

/**
 * Hook to access the QueryClient instance
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  const invalidate = (queryKey: QueryKey) => queryClient.invalidateQueries({ queryKey });

  const invalidateAll = () => queryClient.invalidateQueries();

  const refetch = (queryKey: QueryKey) => queryClient.refetchQueries({ queryKey });

  return {
    invalidate,
    invalidateAll,
    refetch,
    queryClient,
  };
}

// ----------------------------------------------------------------------

/**
 * Hook to reset queries
 */
export function useResetQueries() {
  const queryClient = useQueryClient();

  const reset = (queryKey?: QueryKey) => {
    if (queryKey) {
      return queryClient.resetQueries({ queryKey });
    }
    return queryClient.resetQueries();
  };

  return { reset };
}

// ----------------------------------------------------------------------

/**
 * Hook to get query data
 */
export function useGetQueryData() {
  const queryClient = useQueryClient();

  const getData = <TData = unknown>(queryKey: QueryKey): TData | undefined =>
    queryClient.getQueryData<TData>(queryKey);

  const setData = <TData = unknown>(queryKey: QueryKey, data: TData) =>
    queryClient.setQueryData<TData>(queryKey, data);

  return { getData, setData };
}
