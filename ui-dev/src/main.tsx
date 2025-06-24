import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './bridge/juce';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Error caught by boundary:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500 bg-red-50">
          <h1>Something went wrong.</h1>
          <p>Check the console for more information.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

console.log('Rendering application...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Root element not found');
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render application:', error);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; color: #ef4444; background: #fef2f2;">
        <h1>Application Error</h1>
        <p>${error instanceof Error ? error.message : 'Unknown error occurred'}</p>
        <p>Check the console for more details.</p>
      </div>
    `;
  }
}
