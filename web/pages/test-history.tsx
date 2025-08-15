import { useMemo } from 'react';
import { ActivityList } from '@/components/history/ActivityList';
import { HistoryFilters } from '@/components/history/HistoryFilters';
import { ExportMenu } from '@/components/history/ExportMenu';
import { Activity } from '@/types/activity';

// Mock data for testing
const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'FILE_UPLOAD',
    userId: 'test-user',
    actorId: 'test-actor',
    projectId: 'test-project',
    createdAt: new Date().toISOString(),
    payload: { fileName: 'test.wav', size: 1024 }
  },
  {
    id: '2',
    type: 'MESSAGE_SENT',
    userId: 'test-user',
    actorId: 'test-actor',
    createdAt: new Date(Date.now() - 60000).toISOString(),
    payload: { messageId: 'msg-1', text: 'Hello world!' }
  },
  {
    id: '3',
    type: 'PLUGIN_INSTALL',
    userId: 'test-user',
    actorId: 'test-actor',
    createdAt: new Date(Date.now() - 120000).toISOString(),
    payload: { pluginName: 'Awesome Plugin' }
  }
];

export default function TestHistoryPage() {
  const items = useMemo(() => mockActivities, []);

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Test History Page</h1>
        <ExportMenu items={items} />
      </div>
      
      <HistoryFilters />
      
      <ActivityList
        items={items}
        onLoadMore={() => console.log('Load more clicked')}
        loadingMore={false}
      />
      
      <div className="text-center py-4 text-gray-500">
        This is a test page to verify History components work correctly.
      </div>
    </div>
  );
}
