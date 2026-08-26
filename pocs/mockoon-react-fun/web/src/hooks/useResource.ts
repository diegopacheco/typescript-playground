import { useCallback, useEffect, useState } from 'react';
import { RequestFailed } from '../api/client.ts';

export type ResourceState<T> = {
  data: T;
  error: string | null;
  loading: boolean;
  reload: () => Promise<void>;
  run: (action: () => Promise<unknown>) => Promise<boolean>;
};

const describe = (cause: unknown): string =>
  cause instanceof RequestFailed || cause instanceof Error ? cause.message : String(cause);

export const useResource = <T>(load: () => Promise<T>, initial: T): ResourceState<T> => {
  const [data, setData] = useState<T>(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setData(await load());
      setError(null);
    } catch (cause) {
      setError(describe(cause));
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const run = useCallback(
    async (action: () => Promise<unknown>): Promise<boolean> => {
      try {
        await action();
        await reload();
        return true;
      } catch (cause) {
        setError(describe(cause));
        return false;
      }
    },
    [reload]
  );

  return { data, error, loading, reload, run };
};
