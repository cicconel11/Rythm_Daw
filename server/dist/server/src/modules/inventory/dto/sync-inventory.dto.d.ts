export declare class PluginDto {
    uid: string;
    name: string;
    vendor: string;
    version: string;
}
export declare class SyncInventoryDto {
    plugins: PluginDto[];
    inventoryHash: string;
}
