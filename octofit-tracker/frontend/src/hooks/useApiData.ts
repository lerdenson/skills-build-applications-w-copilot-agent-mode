import { useEffect, useState } from 'react';

type ApiDataState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

export function useApiData<T>(loadData: () => Promise<T[]>): ApiDataState<T[]> {
  const [state, setState] = useState<ApiDataState<T[]>>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    void loadData()
      .then((data) => {
        if (active) setState({ status: 'success', data });
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message = error instanceof Error ? error.message : String(error);
        setState({ status: 'error', message });
      });
    return () => {
      active = false;
    };
  }, [loadData]);

  return state;
}
