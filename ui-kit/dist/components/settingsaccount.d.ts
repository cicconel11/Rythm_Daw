interface SettingsAccountProps {
    onUpdateAccount: (data: {
        displayName: string;
        email: string;
        bio: string;
    }) => void;
    onAvatarChange: (file: File) => void;
    onRescanPlugins: () => void;
}
export declare function SettingsAccount({ onUpdateAccount, onAvatarChange, onRescanPlugins, }: SettingsAccountProps): import("react/jsx-runtime.js").JSX.Element;
export {};
//# sourceMappingURL=settingsaccount.d.ts.map