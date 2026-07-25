import { useState, useCallback, useEffect } from 'react';
import { SignalementApiDatasource, type Signalement } from '../../../data/datasources/SignalementApiDatasource';

export type FilterStatus = 'all' | 'pending' | 'in_progress' | 'resolved';

export function useReportHistory(datasource: SignalementApiDatasource) {
  const [reports, setReports] = useState<Signalement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await datasource.getAll();
      setReports(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  }, [datasource]);

  useEffect(() => { load(); }, [load]);

  const getFiltered = useCallback((filter: FilterStatus) => {
    if (filter === 'all') return reports;
    const statusMap: Record<string, string> = {
      pending: 'pending',
      in_progress: 'approved',
      resolved: 'collected',
    };
    return reports.filter((r) => r.status === statusMap[filter]);
  }, [reports]);

  return { reports, isLoading, error, refresh: load, getFiltered };
}
