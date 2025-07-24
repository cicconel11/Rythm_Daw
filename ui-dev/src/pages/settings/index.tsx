import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Lock, Bell, CreditCard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const settingsTabs = [
  { id: "account", label: "Account", icon: <User className="h-4 w-4" /> },
  { id: "security", label: "Security", icon: <Lock className="h-4 w-4" /> },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="h-4 w-4" />,
  },
  { id: "billing", label: "Billing", icon: <CreditCard className="h-4 w-4" /> },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    const path = location.pathname.split("/").pop() || "account";
    setActiveTab(path === "settings" ? "account" : path);
  }, [location.pathname]);

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex items-center space-x-4 mb-8">
        <Settings className="h-8 w-8 text-purple-400" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs value={activeTab} className="space-y-8">
        <TabsList className="w-full justify-start bg-gray-900 p-1 h-auto rounded-lg">
          {settingsTabs.map((tab) => {
            const to =
              tab.id === "account" ? "/settings" : `/settings/${tab.id}`;
            return (
              <Link to={to} key={tab.id} className="w-full">
                <TabsTrigger
                  value={tab.id}
                  className="w-full justify-start space-x-2 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </TabsTrigger>
              </Link>
            );
          })}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="bg-gray-900 rounded-lg p-6">{children}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
