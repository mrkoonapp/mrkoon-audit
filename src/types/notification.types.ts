// ----------------------------------------------------------------------
// Notification Types
// ----------------------------------------------------------------------

export interface INotification {
  id: number;
  title: string;
  desc: string;
  model_type: string;
  model_id: number;
  is_read: number;
  user: {
    id: number;
    name: string;
    image: string;
  };
  created_at: string;
}

export enum NOTIFICATION_TYPE {
  PRODUCT = '1',
  AUCTION = '2',
  ORDER = '3',
  USER = '4',
  MENU = '5',
  AUCTIONS = '6',
}

export enum NOTIFICATION_IS_READ {
  READ = 1,
  UNREAD = 2,
}

export interface INotificationFilters {
  model_id?: string;
  page?: number;
  limit?: number;
  read?: number | string;
  model_type?: NOTIFICATION_TYPE | string;
  isEnabled?: boolean;
  [key: string]: unknown;
}

export interface INotificationResponse {
  data: INotification[];
  pagination: {
    count: number;
    current_page: number;
    is_pagination: boolean;
    per_page: number;
    total: number;
    total_pages: number;
  };
  unread_count: number;
}
