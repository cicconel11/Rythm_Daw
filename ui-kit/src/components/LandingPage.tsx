
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

function LandingArt() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple/20 to-[#6B3FE6]/20 rounded-2xl blur-xl"></div>
        <Card className="relative bg-gradient-to-br from-navy to-[#1A2142] border-border">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-4 bg-purple/30 rounded w-24"></div>
                <div className="h-2 bg-muted rounded w-32"></div>
                <div className="h-2 bg-muted rounded w-28"></div>
                <div className="h-8 bg-purple/50 rounded w-20"></div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-4/5"></div>
                <div className="h-3 bg-purple/40 rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple to-[#6B3FE6] rounded-full flex items-center justify-center">
                <span className="text-white font-bold font-['JetBrains_Mono']">R</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-radial from-navyDeep to-navy">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 font-['Inter']">
              Collaborate in your DAW—
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple to-[#6B3FE6]">
                instantly.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Connect with producers worldwide, share plugins in real-time, and create music together without leaving your favorite DAW.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={onGetStarted}
                className="bg-purple hover:bg-[#976BFF] text-white px-8 py-4 text-lg font-semibold font-['Inter']"
              >
                Get Started Free
              </Button>
              <Button 
                onClick={onLogin}
                variant="outline"
                className="border-border text-muted-foreground hover:bg-secondary px-8 py-4 text-lg font-['Inter']"
              >
                Log in
              </Button>
            </div>
          </div>
          
          <div className="mb-16">
            <LandingArt />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <Card className="bg-gradient-to-br from-card to-secondary border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-purple rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 font-['Inter']">Real-time Sync</h3>
                <p className="text-muted-foreground">Your plugins sync instantly across all connected devices and collaborators.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card to-secondary border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-purple rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 font-['Inter']">Cross-DAW</h3>
                <p className="text-muted-foreground">Works with Ableton, Logic, FL Studio, Pro Tools, and more.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card to-secondary border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-purple rounded-sm"></div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 font-['Inter']">Plugin Sharing</h3>
                <p className="text-muted-foreground">Share presets, settings, and collaborate on sounds in real-time.</p>
              </CardContent>
            </Card>
          </div>
          
          <footer className="mt-20 text-center border-t border-border pt-8">
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <button className="hover:text-foreground transition-colors">Terms of Service</button>
              <button className="hover:text-foreground transition-colors">Privacy Policy</button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
