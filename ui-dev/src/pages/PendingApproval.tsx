import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PendingApproval = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear auth state and redirect to sign in
    localStorage.removeItem('auth');
    navigate('/signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Account Pending Approval</h1>
          <p className="text-gray-400">
            Your account is currently under review. You'll be able to access all features once approved.
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-blue-400">Awaiting admin approval</span>
        </div>
        
        <div className="pt-4">
          <p className="text-sm text-gray-500 mb-4">
            This typically takes 24-48 hours. You'll receive an email once your account is approved.
          </p>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="mt-4"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
