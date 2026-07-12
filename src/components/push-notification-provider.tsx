import { usePushNotifications } from 'src/hooks/use-push-notifications';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function PushNotificationProvider({ children }: Props) {
  usePushNotifications();

  return children;
}
