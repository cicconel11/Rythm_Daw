interface Plugin {
    id: string;
    name: string;
    version: string;
    status: "active" | "inactive";
    cpuUsage: number;
    lastUsed: Date;
    sessions: number;
    type: string;
}
interface PluginsState {
    plugins: Plugin[];
    activePlugins: Plugin[];
    inactivePlugins: Plugin[];
    updatePluginStatus: (pluginId: string, status: "active" | "inactive") => void;
    getPluginById: (pluginId: string) => Plugin | undefined;
}
export declare const usePluginsStore: import("zustand").UseBoundStore<import("zustand").StoreApi<PluginsState>>;
export {};
//# sourceMappingURL=usePluginsStore.d.ts.map