interface LoginPageProps {
    onLogin: (data: {
        email: string;
        password: string;
    }) => void;
    onCreateAccount: () => void;
    onForgotPassword: () => void;
}
export declare function LoginPage({ onLogin, onCreateAccount, onForgotPassword, }: LoginPageProps): import("react/jsx-runtime.js").JSX.Element;
export {};
//# sourceMappingURL=loginpage.d.ts.map