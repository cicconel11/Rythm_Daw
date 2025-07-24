import { LandingPage } from "@/components/landing/LandingPage";

export default function Home() {
  return (
    <LandingPage
      onGetStarted={() => (window.location.href = "/dashboard")}
      onLogin={() => (window.location.href = "/login")}
    />
  );
}
