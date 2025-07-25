import React from "react";

/**
 * Mock implementation of useDashboard hook for testing purposes
 * In a real application, this would fetch dashboard data from an API
 */
export const useDashboard = () => {
  // Mock data for testing
  const dashboardData = {
    stats: {
      totalFiles: 0,
      totalStorage: "0 MB",
      recentActivity: [],
    },
    isLoading: false,
    error: null,
  };

  return dashboardData;
};
