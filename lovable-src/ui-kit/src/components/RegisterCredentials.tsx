
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface RegisterCredentialsProps {
  onContinue: (data: { email: string; password: string; displayName: string }) => void;
}

export function RegisterCredentials({ onContinue }: RegisterCredentialsProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const isValid = email.includes('@') && password.length >= 8 && displayName.length >= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onContinue({ email, password, displayName });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1126] bg-gradient-to-br from-[#0D1126] via-[#141B33] to-[#0D1126] flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl font-['JetBrains_Mono']">R</span>
          </div>
          <CardTitle className="text-2xl font-bold text-white font-['Inter']">Create Account</CardTitle>
          <p className="text-gray-400">Join the RHYTHM community</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0D1126] border-gray-600 text-white"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0D1126] border-gray-600 text-white"
                placeholder="8+ characters"
                required
              />
            </div>
            <div>
              <Label htmlFor="displayName" className="text-gray-300">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-[#0D1126] border-gray-600 text-white"
                placeholder="Your producer name"
                required
              />
            </div>
            <Button 
              type="submit"
              disabled={!isValid}
              className="w-full bg-[#7E4FFF] hover:bg-[#6B3FE6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold"
            >
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
