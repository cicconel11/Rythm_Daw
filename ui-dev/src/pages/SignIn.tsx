import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import SocialAuth from "@/components/auth/SocialAuth";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { initializeFirstAdmin } from "@/utils/initAdmin";

const SignIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Check if we need to initialize the first admin
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const authStr = localStorage.getItem("auth");
      const auth = authStr ? JSON.parse(authStr) : null;

      // If no users exist, initialize first admin
      if (existingUsers.length === 0) {
        const adminCredentials = initializeFirstAdmin();

        if (adminCredentials) {
          toast({
            title: "Admin account created!",
            description: `Use ${adminCredentials.email} with password ${adminCredentials.password} to sign in.`,
            variant: "default",
          });

          // Auto-redirect to dashboard since we're already logged in
          navigate("/dashboard");
          return;
        }
      }

      // If user is already logged in, redirect to dashboard
      if (auth?.isAuthenticated) {
        if (auth.isApproved) {
          navigate("/dashboard");
        } else {
          navigate("/pending-approval");
        }
      }
    } catch (error) {
      console.error("Error initializing admin:", error);
      toast({
        title: "Error",
        description: "Failed to initialize application",
        variant: "destructive",
      });
    }
  }, [navigate]);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Panel - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-10 order-2 md:order-1">
          <div className="w-full max-w-md space-y-4">
            <div className="text-center">
              <Link
                to="/"
                className="inline-block text-3xl font-bold heading-gradient mb-6"
              >
                RHYTHM
              </Link>
              <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
              <p className="text-muted-foreground mb-6">
                Sign in to continue your musical journey
              </p>
            </div>

            {/* Regular Sign In Form */}
            <Card>
              <CardContent className="pt-6">
                <AuthForm isSignUp={false} />
              </CardContent>
            </Card>

            {/* Social Auth Buttons */}
            <SocialAuth />

            <div className="pt-4 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-rhythm-purple hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="flex justify-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>

        {/* Right Panel - Hero Content */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-rhythm-purple/20 to-background p-10 items-center justify-center order-1 md:order-2">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6 heading-gradient">
              Welcome to RHYTHM
            </h1>
            <p className="text-xl text-foreground/80">
              Continue your musical journey and collaborate with artists
              worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
