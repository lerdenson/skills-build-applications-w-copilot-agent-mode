import type { ReactNode } from 'react';
import { useApiData } from '../hooks/useApiData.js';

type Props<T> = {
  title: string;
  description: string;
  loadData: () => Promise<T[]>;
  emptyMessage: string;
  renderItem: (item: T) => ReactNode;
};

export function CapabilityCard<T>({ title, description, loadData, emptyMessage, renderItem }: Props<T>) {
  const resource = useApiData<T>(loadData);

  return (
    <section className="card h-100" aria-busy={resource.status === 'loading'}>
      <div className="card-body">
        <h2 className="h4">{title}</h2>
        <p>{description}</p>
        {resource.status === 'loading' && <p role="status">Loading {title.toLowerCase()}...</p>}
        {resource.status === 'error' && (
          <p role="alert">Unable to load {title.toLowerCase()}: {resource.message}</p>
        )}
        {resource.status === 'success' && resource.data.length === 0 && <p>{emptyMessage}</p>}
        {resource.status === 'success' && resource.data.length > 0 && (
          <ul className="list-group list-group-flush">
            {resource.data.map((item, index) => <li className="list-group-item" key={index}>{renderItem(item)}</li>)}
          </ul>
        )}
      </div>
    </section>
  );
}
