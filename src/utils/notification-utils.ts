import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export type NotificationDateCategory = 'today' | 'yesterday' | 'lastWeek' | 'lastMonth' | 'older';

export const categorizeNotificationDate = (
  date: Date | string | number
): NotificationDateCategory => {
  const notificationDate = dayjs(date);

  if (!notificationDate.isValid()) {
    return 'older';
  }

  const now = dayjs();
  const diffDays = now.startOf('day').diff(notificationDate.startOf('day'), 'day');

  if (diffDays <= 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return 'lastWeek';
  if (diffDays < 30) return 'lastMonth';

  return 'older';
};
