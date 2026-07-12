import type { InfiniteData } from '@tanstack/react-query';
import type { INotificationFilters, INotificationResponse } from 'src/types/notification.types';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useInfiniteQueries } from 'src/hooks/use-infinite-queries';

import { endpoints } from 'src/utils/endpoints';
import { queryKeys } from 'src/utils/query-keys';

import { get, post } from 'src/lib/axios';
import { useAppDispatch } from 'src/store';
import { buildQueryParams } from 'src/lib/api-helpers';
import { userActions } from 'src/store/slices/user-slice';

import { toast } from 'src/components/snackbar';

import { NOTIFICATION_IS_READ } from 'src/types/notification.types';

// ----------------------------------------------------------------------
// API Functions
// ----------------------------------------------------------------------

export async function getInfiniteNotifications({
  queryKey,
  pageParam,
}: {
  queryKey: readonly unknown[];
  pageParam: number;
}): Promise<INotificationResponse> {
  const params = queryKey.at(-1) as Record<string, unknown>;
  const queryParams = buildQueryParams({ ...params, page: pageParam });
  const response = await get<{ data: INotificationResponse }>(
    `${endpoints.notifications.get}${queryParams}`
  );
  return response.data.data;
}

export async function markAllNotificationsAsRead(): Promise<{ message: string }> {
  const response = await post(endpoints.notifications.markAllAsRead);
  return response.data;
}

export async function readNotification(notificationId: number): Promise<{ message: string }> {
  const response = await post(endpoints.notifications.read, { notification_id: notificationId });
  return response.data;
}

export async function updateFcmToken(token: string): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append('fire_base_token', token);
  const response = await post(endpoints.auth.updateFcmToken, formData);
  return response.data;
}

// ----------------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------------

export function useGetInfiniteNotifications(filters: INotificationFilters) {
  const { isEnabled, ...rest } = filters;

  return useInfiniteQueries({
    queryKey: queryKeys.notifications.list(rest),
    queryFn: getInfiniteNotifications,
    enabled: isEnabled ?? true,
  });
}

// ----------------------------------------------------------------------

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all });

      const previousData = queryClient.getQueriesData({
        queryKey: queryKeys.notifications.all,
      });

      queryClient.setQueriesData<InfiniteData<INotificationResponse>>(
        { queryKey: queryKeys.notifications.all },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              unread_count: 0,
              data: page.data.map((notification) => ({
                ...notification,
                is_read: NOTIFICATION_IS_READ.READ,
              })),
            })),
          };
        }
      );

      dispatch(userActions.setUnreadNotificationCount(0));
      return { previousData };
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? 'All notifications marked as read');
    },
    onError: (error, _, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      toast.error('Failed to mark notifications as read');
      console.error(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

// ----------------------------------------------------------------------

export function useReadNotification() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: readNotification,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all });

      const previousData = queryClient.getQueriesData({
        queryKey: queryKeys.notifications.all,
      });

      let wasUnread = false;

      queryClient.setQueriesData<InfiniteData<INotificationResponse>>(
        { queryKey: queryKeys.notifications.all },
        (oldData) => {
          if (!oldData) return oldData;

          oldData.pages.forEach((page) => {
            const found = page.data.find((n) => n.id === notificationId);
            if (found && found.is_read === NOTIFICATION_IS_READ.UNREAD) {
              wasUnread = true;
            }
          });

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((notification) =>
                notification.id === notificationId
                  ? { ...notification, is_read: NOTIFICATION_IS_READ.READ }
                  : notification
              ),
              unread_count: wasUnread ? Math.max(0, page.unread_count - 1) : page.unread_count,
            })),
          };
        }
      );

      if (wasUnread) {
        dispatch(userActions.decrementUnreadCount());
      }

      return { previousData };
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}
