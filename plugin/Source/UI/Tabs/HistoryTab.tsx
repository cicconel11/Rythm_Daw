import * as React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@store';

const HistoryTab = () => {
  const [showDiff, setShowDiff] = React.useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = React.useState<number | null>(null);

  const snapshots = [
    { id: 1, name: 'Kick tweak', timestamp: '10 minutes ago' },
    { id: 2, name: 'Vocal comp', timestamp: '2 hours ago' },
  ];

  const handleDiffClick = (id: number) => {
    setSelectedSnapshot(id);
    setShowDiff(true);
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-br-xl overflow-hidden relative shadow-inner-md">
      <h3 className="text-lg font-medium p-4 text-text_primary">History</h3>
      <div className="flex-1 overflow-y-auto px-4 relative">
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-700" />
        {snapshots.map((snapshot, index) => (
          <div
            key={snapshot.id}
            className="relative mb-6"
          >
            <div className="absolute left-[-18px] top-2 w-4 h-4 rounded-full bg-brand border-2 border-background" />
            <div className="ml-6 bg-card rounded-lg p-3 shadow-inner-md border border-gray-700">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-text_primary truncate flex-1">{snapshot.name}</span>
                <span className="text-xs text-text_secondary flex-shrink-0">{snapshot.timestamp}</span>
              </div>
              <button
                onClick={() => handleDiffClick(snapshot.id)}
                className="text-xs text-brand hover:underline mt-1"
              >
                View Diff
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Diff Modal */}
      {showDiff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-4">
          <div className="bg-panel rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-outer-md border border-gray-700">
            <h4 className="text-xl font-medium mb-4 text-text_primary">Snapshot Diff - {snapshots.find(s => s.id === selectedSnapshot)?.name}</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-card p-3 rounded-lg border border-gray-700 shadow-inner-md">
                <h5 className="text-sm font-medium text-text_secondary mb-2">Before</h5>
                <pre className="text-xs text-text_primary whitespace-pre-wrap font-mono bg-black/30 p-2 rounded overflow-x-auto">
                  <code>{`{
  "kickVolume": 0.5,
  "kickPan": 0.0
}`}</code>
                </pre>
              </div>
              <div className="bg-card p-3 rounded-lg border border-gray-700 shadow-inner-md">
                <h5 className="text-sm font-medium text-text_secondary mb-2">After</h5>
                <pre className="text-xs text-text_primary whitespace-pre-wrap font-mono bg-black/30 p-2 rounded overflow-x-auto">
                  <code>{`{
  "kickVolume": 0.7,
  "kickPan": -0.2
}`}</code>
                </pre>
              </div>
            </div>
            <button
              onClick={() => setShowDiff(false)}
              className="px-4 py-2 bg-brand rounded-md text-text_primary hover:bg-opacity-90 transition-colors duration-200 shadow-outer-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
