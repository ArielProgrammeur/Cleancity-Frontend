import { useState, useCallback, useEffect } from 'react';
import type { INotificationDatasource, Notification } from '../../../data/datasources/INotificationDatasource';

export function useNotifications(datasource: INotificationDatasource) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await datasource.getAll();
      setNotifications(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [datasource]);

  useEffect(() => { load(); }, [load]);

  const markAsRead = useCallback(async (id: string) => {
    await datasource.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, [datasource]);

  return { notifications, isLoading, error, refresh: load, markAsRead };
}
