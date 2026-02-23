import { Component, ErrorInfo, ReactNode } from 'react';
import { getButtonHoverHandlers } from '../utils/buttonHover';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background-light)] px-6">
          <div className="text-center max-w-md">
            <h2 
              className="text-4xl mb-4 text-[var(--color-primary)]"
              style={{ fontFamily: 'var(--font-stack-heading)' }}
            >
              OOPS!
            </h2>
            <p className="text-lg text-[var(--color-text-dark)]/70 mb-8">
              Something went wrong. Please refresh the page or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block px-8 py-4 border-2 cursor-pointer transition-all duration-200 uppercase bg-[var(--color-primary)] text-[var(--color-background-light)] border-[var(--color-text-dark)]"
              style={{
                fontFamily: 'var(--font-stack-heading)',
                boxShadow: 'var(--shadow-button)',
              }}
              {...getButtonHoverHandlers()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
