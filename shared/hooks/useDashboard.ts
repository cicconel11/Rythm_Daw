import React from "react";

interface DashboardStats {
  totalFiles: number;
  totalStorage: string;
  recentActivity: any[];
}

interface UseDashboardReturn {
  stats: DashboardStats;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Mock implementation of useDashboard hook for testing purposes
 * In a real application, this would fetch dashboard data from an API
 */
export const useDashboard = (): UseDashboardReturn => {
  // Mock data for testing
  const dashboardData = {
    stats: {
      totalFiles: 0,
      totalStorage: "0 MB",
      recentActivity: [],
    },
    isLoading: false,
    isError: false,
    error: null,
  };

  return dashboardData;
};
