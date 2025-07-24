import '../styles/globals.css';
import '../../lovable-src/ui-kit/src/styles/globals.css';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
