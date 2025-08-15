import { useState, useEffect } from 'react';
import { ActivityType } from '@/types/activity';
import { useHistoryStore } from '@/hooks/useHistoryStore';

const ACTIVITY_TYPES: ActivityType[] = [
  'FILE_UPLOAD', 'FILE_DOWNLOAD', 'FILE_SHARE', 'FILE_TRANSFER',
  'MESSAGE_SENT', 'MESSAGE_RECEIVED', 'CHAT_SESSION',
  'FRIEND_REQUEST', 'FRIEND_CONNECTED', 'PROFILE_UPDATE',
  'PLUGIN_INSTALL', 'PLUGIN_UNINSTALL', 'SETTINGS_CHANGE',
  'LOGIN', 'LOGOUT', 'PROJECT_SHARE', 'VERSION_UPDATE', 'COMMENT'
];

export function HistoryFilters() {
  const { filters, setFilters } = useHistoryStore();
  const [searchQuery, setSearchQuery] = useState(filters.q || '');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ q: searchQuery || undefined });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, setFilters]);

  const handleTypeToggle = (type: ActivityType) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    setFilters({ types: newTypes });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    const newRange = { ...filters.dateRange };
    if (value) {
      newRange[field] = new Date(value);
    } else {
      delete newRange[field];
    }
    setFilters({ dateRange: newRange });
  };

  const clearFilters = () => {
    setFilters({
      types: [],
      dateRange: {},
      user: undefined,
      actor: undefined,
      projectId: undefined,
      q: undefined
    });
    setSearchQuery('');
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Clear all
        </button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search in activity details..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Activity Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Activity Types
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {ACTIVITY_TYPES.map(type => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.types.includes(type)}
                onChange={() => handleTypeToggle(type)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {type.replace(/_/g, ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* User/Actor/Project IDs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <input
            type="text"
            value={filters.user || ''}
            onChange={(e) => setFilters({ user: e.target.value || undefined })}
            placeholder="Filter by user ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Actor ID
          </label>
          <input
            type="text"
            value={filters.actor || ''}
            onChange={(e) => setFilters({ actor: e.target.value || undefined })}
            placeholder="Filter by actor ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project ID
          </label>
          <input
            type="text"
            value={filters.projectId || ''}
            onChange={(e) => setFilters({ projectId: e.target.value || undefined })}
            placeholder="Filter by project ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
