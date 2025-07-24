import { HistoryList } from '@ui-kit/components/History';
import { useActivity } from '@shared/hooks/useActivity';

export default function HistoryPage() {
  const hook = useActivity();
  return <HistoryList {...hook} />;
} 