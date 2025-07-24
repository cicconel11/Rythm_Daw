import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountSettings from "./AccountSettings";
import { SettingsLayout } from "./";
import useAuth from "@/hooks/useAuth";

export default function AccountSettingsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <SettingsLayout>
      <AccountSettings />
    </SettingsLayout>
  );
}
