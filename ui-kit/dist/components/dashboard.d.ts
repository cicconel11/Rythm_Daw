export interface DashboardProps {
    stats: {
        totalFiles: number;
        totalStorage: string;
        recentActivity: any[];
    };
    onNavigate?: (path: string) => void;
}
export declare function Dashboard({ onNavigate: _onNavigate }: DashboardProps): import("react/jsx-runtime.js").JSX.Element;
//# sourceMappingURL=dashboard.d.ts.map