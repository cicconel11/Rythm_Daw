import { useQuery } from '@tanstack/react-query';
import { api } from '@shared/lib/api';
import { z } from 'zod';
import { ActivitySchema } from '@shared/types';

const ActivityListSchema = z.array(ActivitySchema);

export default function History() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['activity'],
    queryFn: async () => {
      const res = await api.get('/activity');
      return ActivityListSchema.parse(res);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading activity</div>;

  return (
    <div>
      <h2>Activity Timeline</h2>
      <ul>
        {data?.map(item => (
          <li key={item.id}>
            <span>
              {item.timestamp} — {item.type}: {item.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
