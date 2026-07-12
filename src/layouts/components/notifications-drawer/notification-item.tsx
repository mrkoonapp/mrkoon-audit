import type { INotification } from 'src/types/notification.types';
import type { IconifyName } from 'src/components/iconify/register-icons';

import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { Iconify } from 'src/components/iconify';

import { NOTIFICATION_TYPE, NOTIFICATION_IS_READ } from 'src/types/notification.types';

// ----------------------------------------------------------------------

const NOTIFICATION_ICONS: Record<string, IconifyName> = {
  [NOTIFICATION_TYPE.AUCTION]: 'solar:cup-star-bold',
  [NOTIFICATION_TYPE.ORDER]: 'solar:cart-3-bold',
  [NOTIFICATION_TYPE.PRODUCT]: 'solar:box-minimalistic-bold',
  [NOTIFICATION_TYPE.USER]: 'solar:user-id-bold',
  [NOTIFICATION_TYPE.MENU]: 'solar:list-bold',
  [NOTIFICATION_TYPE.AUCTIONS]: 'solar:bill-list-bold',
};

const NOTIFICATION_ICON_COLORS: Record<string, string> = {
  [NOTIFICATION_TYPE.AUCTION]: 'warning.main',
  [NOTIFICATION_TYPE.ORDER]: 'info.main',
  [NOTIFICATION_TYPE.PRODUCT]: 'success.main',
  [NOTIFICATION_TYPE.USER]: 'primary.main',
  [NOTIFICATION_TYPE.MENU]: 'secondary.main',
  [NOTIFICATION_TYPE.AUCTIONS]: 'error.main',
};

// ----------------------------------------------------------------------

type NotificationItemProps = {
  notification: INotification;
  onMarkAsRead?: (id: number) => void;
};

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const isUnread = notification.is_read === NOTIFICATION_IS_READ.UNREAD;
  const iconName = NOTIFICATION_ICONS[notification.model_type] || 'solar:bell-bing-bold';
  const iconColor = NOTIFICATION_ICON_COLORS[notification.model_type] || 'text.secondary';

  const handleClick = () => {
    if (isUnread && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <ListItemButton
      onClick={handleClick}
      sx={[
        (theme) => ({
          p: 2.5,
          gap: 2,
          alignItems: 'flex-start',
          borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
          ...(isUnread && {
            bgcolor: 'action.selected',
          }),
        }),
      ]}
    >
      {/* Unread badge */}
      {isUnread && (
        <Box
          sx={{
            top: 26,
            width: 8,
            height: 8,
            right: 20,
            borderRadius: '50%',
            bgcolor: 'info.main',
            position: 'absolute',
          }}
        />
      )}

      {/* Icon */}
      <Box
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          display: 'flex',
          borderRadius: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.neutral',
        }}
      >
        <Iconify icon={iconName} width={24} sx={{ color: iconColor }} />
      </Box>

      {/* Content */}
      <ListItemText
        primary={notification.title}
        secondary={
          <>
            {notification.desc}
            <Box
              component="span"
              sx={{
                mt: 0.5,
                gap: 0.5,
                display: 'flex',
                alignItems: 'center',
                typography: 'caption',
                color: 'text.disabled',
              }}
            >
              <Iconify icon="solar:clock-circle-outline" width={14} />
              {notification.created_at}
            </Box>
          </>
        }
        slotProps={{
          primary: {
            sx: { mb: 0.5, typography: 'subtitle2' },
          },
          secondary: {
            sx: {
              typography: 'body2',
              color: 'text.secondary',
            },
          },
        }}
      />
    </ListItemButton>
  );
}
