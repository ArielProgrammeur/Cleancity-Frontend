import { Ionicons } from '@expo/vector-icons';

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
}

export interface INotificationDatasource {
  getAll(): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
  getUnreadCount(): Promise<number>;
}
