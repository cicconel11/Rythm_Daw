// React Day Picker
declare module 'react-day-picker' {
  import { ComponentType } from 'react';
  
  export interface DayPickerProps {
    mode?: 'single' | 'multiple' | 'range';
    selected?: Date | Date[] | { from: Date; to: Date } | undefined;
    onSelect?: (date: Date | Date[] | { from: Date; to: Date } | undefined) => void;
    disabled?: boolean | ((date: Date) => boolean);
    className?: string;
    // Add other props as needed
  }

  const DayPicker: ComponentType<DayPickerProps>;
  export default DayPicker;
}

// ReCAPTCHA
declare module 'react-google-recaptcha' {
  import { ComponentType, RefObject } from 'react';

  interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    onExpired?: () => void;
    onError?: (error: any) => void;
    size?: 'normal' | 'compact' | 'invisible';
    theme?: 'light' | 'dark';
    tabindex?: number;
    hl?: string;
    ref?: RefObject<ReCAPTCHA>;
    asyncScriptOnLoad?: () => void;
  }

  export default class ReCAPTCHA extends ComponentType<ReCAPTCHAProps> {
    execute(): void;
    executeAsync(): Promise<string>;
    reset(): void;
    getValue(): string | null;
    getWidgetId(): number;
  }
}

// NextAuth Credentials Provider
declare module 'next-auth/providers/credentials' {
  import { ProviderType } from 'next-auth/providers';
  
  interface CredentialsConfig {
    id: string;
    name: string;
    type: 'credentials';
    credentials: Record<string, { label?: string; type?: string; placeholder?: string }>;
    authorize: (credentials: Record<string, string>) => Promise<{ id: string; [key: string]: any } | null>;
  }
  
  export default function Credentials(options: Partial<CredentialsConfig>): CredentialsConfig;
}

// Other modules with basic type declarations
declare module 'embla-carousel-react' {
  import { ComponentType, ReactNode, CSSProperties } from 'react';
  
  export interface EmblaOptionsType {
    axis?: 'x' | 'y';
    align?: 'start' | 'center' | 'end' | number;
    containScroll?: boolean | string;
    // Add other options as needed
  }
  
  export interface EmblaCarouselType {
    // Add methods as needed
    on: (event: string, callback: () => void) => void;
    off: (event: string, callback: () => void) => void;
    scrollNext: () => void;
    scrollPrev: () => void;
  }
  
  export interface EmblaCarouselProps {
    children: ReactNode;
    options?: EmblaOptionsType;
    className?: string;
    style?: CSSProperties;
    plugins?: any[];
  }
  
  const EmblaCarousel: ComponentType<EmblaCarouselProps>;
  export default EmblaCarousel;
}

declare module 'recharts' {
  // Basic re-exports of common components
  export * from 'recharts/types/index';
  
  // Add any specific component overrides if needed
  export interface BarChartProps {
    // Add specific props if needed
    [key: string]: any;
  }
  
  export const BarChart: ComponentType<BarChartProps>;
  // Add other chart components as needed
}

declare module 'vaul' {
  import { ComponentType, ReactNode } from 'react';
  
  export interface DrawerProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
    // Add other props as needed
  }
  
  export const Drawer: {
    Root: ComponentType<DrawerProps>;
    Trigger: ComponentType<{ asChild?: boolean; children: ReactNode }>;
    // Add other subcomponents as needed
  };
  
  // Export other components from vaul if needed
}

declare module 'input-otp' {
  import { ComponentType, ReactNode } from 'react';
  
  export interface InputOTPProps {
    value?: string;
    onChange?: (value: string) => void;
    maxLength?: number;
    render: (props: { slots: any[] }) => ReactNode;
    // Add other props as needed
  }
  
  export const InputOTP: ComponentType<InputOTPProps>;
  // Export other components from input-otp if needed
}

declare module 'react-resizable-panels' {
  import { ComponentType, CSSProperties, ReactNode } from 'react';
  
  export interface PanelProps {
    children?: ReactNode;
    defaultSize?: number;
    minSize?: number;
    maxSize?: number;
    style?: CSSProperties;
    // Add other props as needed
  }
  
  export interface PanelGroupProps {
    children: ReactNode;
    direction?: 'horizontal' | 'vertical';
    // Add other props as needed
  }
  
  export const Panel: ComponentType<PanelProps>;
  export const PanelGroup: ComponentType<PanelGroupProps>;
  // Export other components from react-resizable-panels if needed
}

declare module 'react-day-picker';
declare module 'embla-carousel-react';
declare module 'recharts';
declare module 'vaul';
declare module 'input-otp';
declare module 'react-resizable-panels';

// Jest global type
type Jest = typeof import('jest');
declare const jest: Jest;
declare const describe: Jest['describe'];
declare const it: Jest['it'];
declare const expect: Jest['expect'];
declare const beforeAll: Jest['beforeAll'];
declare const afterAll: Jest['afterAll'];
declare const beforeEach: Jest['beforeEach'];
declare const afterEach: Jest['afterEach'];
declare const test: Jest['test'];
// Add any other Jest globals you need
