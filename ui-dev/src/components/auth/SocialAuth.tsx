import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '../ui/icons';

interface SocialAuthProps {
  disabled?: boolean;
}

const SocialAuth = ({ disabled = false }: SocialAuthProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAppleLogin = () => {
    setIsLoading(true);
    window.location.href = '/api/auth/apple';
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Button
          variant="outline"
          type="button"
          onClick={handleGoogleLogin}
          disabled={disabled}
          className="flex items-center justify-center gap-2"
        >
          <Icons.google className="h-4 w-4" />
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={handleAppleLogin}
          disabled={disabled || isLoading}
          className={`flex items-center justify-center gap-2 ${(disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <Icons.spinner className="h-4 w-4 animate-spin" />
          ) : (
            <Icons.apple className="h-4 w-4" />
          )}
          Apple
        </Button>
      </div>
    </div>
  );
};

export default SocialAuth;
