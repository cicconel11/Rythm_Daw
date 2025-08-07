import React, { useState } from "react";
import { Button } from "./ui/button.js";
import { Input } from "./ui/input.js";
import { Label } from "./ui/label.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";

interface LoginPageProps {
  onLogin: (data: { email: string; password: string }) => void;
  onCreateAccount: () => void;
  onForgotPassword: () => void;
}

export function LoginPage({
  onLogin,
  onCreateAccount,
  onForgotPassword,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = email.includes("@") && password.length >= 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onLogin({ email, password });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-navyDeep to-navy flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-gradient-to-br from-navy to-[#1A2142] border-border">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple to-[#6B3FE6] rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl font-['JetBrains_Mono']">
              R
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground font-['Inter']">
            Welcome Back
          </CardTitle>
          <p className="text-muted-foreground">
            Sign in to your RHYTHM account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border text-foreground"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border text-foreground"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={!isValid}
              className="w-full bg-purple hover:bg-[#976BFF] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <button
              onClick={onForgotPassword}
              className="text-purple hover:text-[#976BFF] text-sm underline"
            >
              Forgot password?
            </button>

            <div className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <button
                onClick={onCreateAccount}
                className="text-purple hover:text-[#976BFF] underline"
              >
                Create account
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
