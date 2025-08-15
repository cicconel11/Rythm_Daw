import { saveAs } from 'file-saver';

interface ExportMenuProps {
  items: any[];
}

export function ExportMenu({ items }: ExportMenuProps) {
  const toCSV = () => {
    const cols = ['id', 'type', 'createdAt', 'userId', 'actorId', 'projectId', 'payload'];
    const rows = [
      cols.join(','), 
      ...items.map(i => cols.map(c => JSON.stringify(i[c] ?? '')).join(','))
    ].join('\n');
    
    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `history_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const toJSON = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { 
      type: 'application/json' 
    });
    saveAs(blob, `history_${new Date().toISOString().split('T')[0]}.json`);
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={toCSV}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        Export CSV
      </button>
      <button 
        onClick={toJSON}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Export JSON
      </button>
    </div>
  );
}
