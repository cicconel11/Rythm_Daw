import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import type { AppProps } from 'next/app';

// Import global styles
import '../styles/globals.css';
import '../../lovable-src/ui-kit/src/styles/globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Disable console.log in production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Handle route changes
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // You can add analytics or other route change logic here
      console.log(`App is changing to ${url}`);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Theme>
          <TooltipProvider>
            <Component {...pageProps} />
            <Toaster position="top-center" richColors closeButton />
          </TooltipProvider>
        </Theme>
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
