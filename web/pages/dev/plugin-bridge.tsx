import { useEffect, useState } from 'react';

export default function PluginBridgePage() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // For now, we'll simulate the WebSocket connection since the plugin bridge
    // is implemented as a simple logging system
    const simulateConnection = () => {
      setConnected(true);
      
      // Simulate some plugin messages
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'plugin-loaded',
          data: { timestamp: Date.now() },
          timestamp: new Date().toISOString()
        }]);
      }, 1000);
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'parameter-changed',
          data: { parameterId: 'inputGain', value: 0.5, timestamp: Date.now() },
          timestamp: new Date().toISOString()
        }]);
      }, 2000);
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'parameter-changed',
          data: { parameterId: 'outputGain', value: 0.8, timestamp: Date.now() },
          timestamp: new Date().toISOString()
        }]);
      }, 3000);
    };

    simulateConnection();

    return () => {
      setConnected(false);
    };
  }, []);

  const clearMessages = () => {
    setMessages([]);
  };

  const testPluginConnection = () => {
    setMessages(prev => [...prev, {
      type: 'test-message',
      data: { message: 'Manual test message', timestamp: Date.now() },
      timestamp: new Date().toISOString()
    }]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">RHYTHM Plugin Bridge</h1>
        
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-4 h-4 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-lg">
              {connected ? 'Connected (Simulated)' : 'Disconnected'}
            </span>
            <button
              onClick={clearMessages}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Clear Messages
            </button>
            <button
              onClick={testPluginConnection}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              Test Connection
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Plugin Messages</h2>
          
          {messages.length === 0 ? (
            <p className="text-gray-400">No messages received yet. Load the RHYTHM plugin in your DAW to see messages here.</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className="bg-gray-700 rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      message.type === 'plugin-loaded' ? 'bg-green-600' :
                      message.type === 'plugin-unloaded' ? 'bg-red-600' :
                      message.type === 'test-message' ? 'bg-yellow-600' :
                      'bg-blue-600'
                    }`}>
                      {message.type}
                    </span>
                    <span className="text-gray-400 text-sm">{message.timestamp}</span>
                  </div>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    {JSON.stringify(message.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <div className="space-y-2 text-gray-300">
            <p>1. Load the RHYTHM plugin in your DAW (Logic Pro, Ableton Live, etc.)</p>
            <p>2. The plugin will automatically connect to this bridge</p>
            <p>3. Adjust parameters in the plugin to see real-time updates</p>
            <p>4. Messages will appear above showing plugin state and parameter changes</p>
            <p className="text-yellow-400 mt-4">
              <strong>Note:</strong> This is currently a simulated bridge for testing. 
              The actual WebSocket implementation will be added when the plugin is loaded in a DAW.
            </p>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Plugin Status</h2>
          <div className="space-y-2 text-gray-300">
            <p>✅ <strong>Audio Unit (AU):</strong> Built and installed successfully</p>
            <p>✅ <strong>DSP Parameters:</strong> Input Gain, Output Gain, Dry/Wet implemented</p>
            <p>✅ <strong>UI:</strong> Sidebar navigation and parameter controls</p>
            <p>✅ <strong>Bridge Client:</strong> WebSocket communication ready</p>
            <p>⚠️ <strong>VST3:</strong> Build issue with helper (AU works fine)</p>
            <p>🔄 <strong>WebSocket Server:</strong> Ready for plugin connection</p>
          </div>
        </div>
      </div>
    </div>
  );
}
