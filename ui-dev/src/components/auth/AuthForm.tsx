import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface AuthFormProps {
  isSignUp?: boolean;
}

const AuthForm = ({ isSignUp = false }: AuthFormProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Handle Sign Up
        const response = await axios.post(`${API_URL}/auth/register`, {
          email: formData.email,
          name: formData.displayName,
          password: formData.password
        });

        const { user, token } = response.data;
        
        // Save auth state to localStorage
        localStorage.setItem('auth', JSON.stringify({
          user,
          token,
          isAuthenticated: true,
          isApproved: user.isApproved
        }));
        
        toast({
          title: 'Account created!',
          description: 'Your account has been created successfully',
        });
        
        // Redirect to scan page
        navigate('/scan');
      } else {
        // Handle Sign In
        const response = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password
        });

        const { user, token } = response.data;
        
        // Save auth state to localStorage
        localStorage.setItem('auth', JSON.stringify({
          user,
          token,
          isAuthenticated: true,
          isApproved: user.isApproved
        }));
        
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in',
        });
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: isSignUp ? 'Sign up failed' : 'Sign in failed',
        description: error instanceof Error ? error.message : 
          isSignUp ? 'Something went wrong' : 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = 
    (isSignUp ? formData.displayName.trim() !== '' : true) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.password.length >= 8;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignUp && (
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            name="displayName"
            type="text"
            placeholder="Your stage name"
            value={formData.displayName}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
            disabled={isLoading}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Minimum 8 characters
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            {isSignUp ? 'Creating Account...' : 'Signing In...'}
          </>
        ) : isSignUp ? (
          'Create Account'
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
};

export default AuthForm;
