import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-orange-600 text-white rounded-lg">Refresh Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;