import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type ApiDataState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

export function useApiData<T>(path: string, responseKey: string): ApiDataState<T[]> {
  const [state, setState] = useState<ApiDataState<T[]>>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    void getJson<Record<string, T[]>>(path)
      .then((response) => {
        const data = response[responseKey];
        if (!Array.isArray(data)) throw new Error(`The API response did not include a ${responseKey} list`);
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
  }, [path, responseKey]);

  return state;
}
