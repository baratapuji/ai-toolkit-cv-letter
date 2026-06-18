import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

export function useDashboard(userId: string | undefined) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError('User not authenticated');
      return;
    }

    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await dashboardService.getRecentLogs(userId);
        console.log('Logs fetched:', data); // Debug
        setLogs(data);
      } catch (err: any) {
        console.error('Failed to fetch logs:', err);
        setError(err.message || 'Failed to load logs');
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [userId]);

  return { logs, loading, error };
}