import type { RootState } from 'src/store';
import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import {
  useReadNotification,
  useGetInfiniteNotifications,
  useMarkAllNotificationsAsRead,
} from 'src/api/notifications';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';
import { varTap, varHover, transitionTap } from 'src/components/animate';

import { NOTIFICATION_IS_READ } from 'src/types/notification.types';

import { NotificationItem } from './notification-item';

// ----------------------------------------------------------------------

type TabValue = 'all' | 'unread' | 'read';

// ----------------------------------------------------------------------

export function NotificationsDrawer({ sx, ...other }: IconButtonProps) {
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();
  const { t } = useTranslate('dashboard');
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState<TabValue>('all');

  const unreadCount = useSelector((state: RootState) => state.user.unread_notification_count) || 0;

  // Build filters based on active tab
  const readFilter = (() => {
    if (currentTab === 'read') return NOTIFICATION_IS_READ.READ;
    if (currentTab === 'unread') return NOTIFICATION_IS_READ.UNREAD;
    return undefined;
  })();

  const { data, isPending, ref, isFetchingNextPage } = useGetInfiniteNotifications({
    limit: 20,
    read: readFilter,
    isEnabled: open,
  });

  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();
  const { mutate: markAsRead } = useReadNotification();

  const notifications = data?.pages?.flatMap((page) => page.data) || [];

  const handleChangeTab = useCallback((_: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue as TabValue);
  }, []);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleMarkAsRead = (id: number) => {
    markAsRead(id);
  };

  const handleViewAll = () => {
    onClose();
    router.push(paths.dashboard.notifications);
  };

  // ----------------------------------------------------------------------

  const TABS = [
    { value: 'all', label: t('dashboard.notifications.all') },
    { value: 'unread', label: t('dashboard.notifications.unread'), count: unreadCount },
    { value: 'read', label: t('dashboard.notifications.read') },
  ];

  const renderHead = () => (
    <Box
      sx={{
        py: 2,
        pr: 1,
        pl: 2.5,
        minHeight: 68,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {t('dashboard.notifications.title')}
      </Typography>

      {!!unreadCount && (
        <Tooltip title={t('dashboard.notifications.markAllAsRead')}>
          <IconButton color="primary" onClick={handleMarkAllAsRead} disabled={isMarkingAll}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      <IconButton onClick={onClose} sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Box>
  );

  const renderTabs = () => (
    <CustomTabs variant="fullWidth" value={currentTab} onChange={handleChangeTab}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.count ? (
              <Label
                variant={tab.value === currentTab ? 'filled' : 'soft'}
                color={tab.value === 'unread' ? 'info' : 'default'}
              >
                {tab.count}
              </Label>
            ) : undefined
          }
        />
      ))}
    </CustomTabs>
  );

  const renderList = () => {
    if (isPending) {
      return (
        <Stack spacing={1} sx={{ p: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Stack key={i} direction="row" spacing={2} sx={{ p: 1 }}>
              <Skeleton variant="rounded" width={44} height={44} />
              <Stack spacing={0.5} sx={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </Stack>
            </Stack>
          ))}
        </Stack>
      );
    }

    if (notifications.length === 0) {
      return (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 8, gap: 1 }}>
          <Iconify icon="solar:bell-off-bold" width={48} sx={{ color: 'text.disabled' }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('dashboard.notifications.empty')}
          </Typography>
        </Stack>
      );
    }

    return (
      <Scrollbar sx={{ maxHeight: { xs: 'calc(100vh - 240px)', sm: 'calc(100vh - 240px)' } }}>
        <Box component="ul">
          {notifications.map((notification) => (
            <Box component="li" key={notification.id} sx={{ display: 'flex' }}>
              <NotificationItem notification={notification} onMarkAsRead={handleMarkAsRead} />
            </Box>
          ))}
        </Box>

        {/* Infinite scroll sentinel */}
        <Box ref={ref} sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          {isFetchingNextPage && <CircularProgress size={24} />}
        </Box>
      </Scrollbar>
    );
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap={varTap(0.96)}
        whileHover={varHover(1.04)}
        transition={transitionTap()}
        aria-label="Notifications button"
        onClick={onOpen}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={unreadCount} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 1, maxWidth: 420 } },
        }}
      >
        {renderHead()}
        {renderTabs()}
        {renderList()}

        <Box sx={{ p: 1 }}>
          <Button fullWidth size="large" onClick={handleViewAll}>
            {t('dashboard.table.viewAll')}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
