import { api } from "../../core/api/api";
import { auth } from "../../core/firebase";
import { INotificationDatasource, Notification } from "./INotificationDatasource";

export class NotificationApiDatasource implements INotificationDatasource {
  private getUserId(): string | null {
    try {
      if (!auth) return null;
      return auth.currentUser?.uid ?? null;
    } catch {
      return null;
    }
  }

  async getAll(): Promise<Notification[]> {
    const userId = this.getUserId();
    if (!userId) return [];
    return api.get<Notification[]>(`/api/notifications/${userId}`);
  }

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/api/notifications/${id}/read`);
  }

  async getUnreadCount(): Promise<number> {
    const notifications = await this.getAll();
    return notifications.filter((n) => !n.read).length;
  }
}
