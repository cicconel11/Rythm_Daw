import { Link } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import SocialAuth from "@/components/auth/SocialAuth";
import { Card, CardContent } from "@/components/ui/card";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Panel - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-10 order-2 md:order-1">
          <div className="w-full max-w-md space-y-4">
            <div className="text-center">
              <Link to="/" className="inline-block text-3xl font-bold heading-gradient mb-6">
                RHYTHM
              </Link>
              <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of musicians and start collaborating today
              </p>
            </div>
            
            {/* Regular Sign Up Form */}
            <Card>
              <CardContent className="pt-6">
                <AuthForm isSignUp={true} />
              </CardContent>
            </Card>
            
            {/* Social Auth Buttons */}
            <SocialAuth />
            
            <div className="pt-4 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/signin" className="text-rhythm-purple hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
            
            <div className="flex justify-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Back to home
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Hero Content */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-rhythm-purple/20 to-background p-10 items-center justify-center order-1 md:order-2">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6 heading-gradient">
              Join the RHYTHM Community
            </h1>
            <p className="text-xl text-foreground/80">
              Create your profile, connect with other musicians, and bring your musical ideas to life.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
