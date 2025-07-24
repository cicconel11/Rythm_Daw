
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Download } from 'lucide-react';

interface OnboardScanProps {
  onDownload: () => void;
  onSkip: () => void;
}

export function OnboardScan({ onDownload, onSkip }: OnboardScanProps) {
  const detectOS = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Windows')) return 'Windows';
    return 'your OS';
  };

  return (
    <div className="min-h-screen bg-[#0D1126] bg-gradient-to-br from-[#0D1126] via-[#141B33] to-[#0D1126] flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl font-['JetBrains_Mono']">R</span>
          </div>
          <CardTitle className="text-3xl font-bold text-white font-['Inter'] mb-2">
            Scan your plug-ins
          </CardTitle>
          <p className="text-gray-400 text-lg">
            Download RHYTHM for your DAW to get started
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-[#0D1126] rounded-lg p-8 border border-gray-700">
            <div className="flex items-center justify-center space-x-8">
              <div className="w-24 h-16 bg-gradient-to-br from-[#7E4FFF]/20 to-[#6B3FE6]/20 rounded border border-[#7E4FFF]/30 flex items-center justify-center">
                <span className="text-[#7E4FFF] font-bold text-sm">DAW</span>
              </div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-[#7E4FFF] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[#7E4FFF] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-[#7E4FFF] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <div className="w-24 h-16 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm font-['JetBrains_Mono']">RHYTHM</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={onDownload}
              className="bg-[#7E4FFF] hover:bg-[#6B3FE6] text-white px-8 py-4 text-lg font-semibold"
            >
              <Download className="w-5 h-5 mr-2" />
              Download for {detectOS()}
            </Button>
            
            <p className="text-gray-500">
              <button 
                onClick={onSkip}
                className="text-[#7E4FFF] hover:text-[#6B3FE6] underline"
              >
                I'll install later → Dashboard
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
