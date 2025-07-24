"use client";

import { useRouter } from "next/navigation";
import { LandingPage } from "@rythm/ui-kit";

export default function LandingPageWrapper() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/register/credentials");
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  return <LandingPage onGetStarted={handleGetStarted} onLogin={handleLogin} />;
}
