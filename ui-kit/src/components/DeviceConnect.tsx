
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

interface DeviceConnectProps {
  onConnected: () => void;
}

export function DeviceConnect({ onConnected }: DeviceConnectProps) {
  const [code] = useState('ABC 123');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          onConnected();
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [onConnected]);

  return (
    <div className="min-h-screen bg-[#0D1126] bg-gradient-to-br from-[#0D1126] via-[#141B33] to-[#0D1126] flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl font-['JetBrains_Mono']">R</span>
          </div>
          <CardTitle className="text-3xl font-bold text-white font-['Inter'] mb-2">
            Connect your device
          </CardTitle>
          <p className="text-gray-400 text-lg">
            Enter this code in the RHYTHM plug-in to link this browser
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-8">
          <div className="bg-[#0D1126] rounded-lg p-8 border border-gray-700">
            <div className="text-6xl font-bold text-[#7E4FFF] font-['JetBrains_Mono'] tracking-wider mb-4">
              {code}
            </div>
            <div className="w-32 h-32 bg-white rounded-lg mx-auto p-4">
              <div className="w-full h-full bg-gray-900 rounded grid grid-cols-8 gap-1">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-gray-900'}`}></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Waiting for connection...</span>
              <span className="text-[#7E4FFF]">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
