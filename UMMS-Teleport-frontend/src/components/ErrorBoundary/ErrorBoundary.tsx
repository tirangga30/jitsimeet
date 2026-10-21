import React, { type ReactNode } from 'react';
import { Box, Button, Message, Title, Wrapper } from './ErrorBoundary.styles';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Wrapper>
          <Box>
            <Title>Something went wrong 😢</Title>
            <Message>An unexpected error occurred. Please refresh the page.</Message>
            <Button onClick={this.handleReload}>Reload</Button>
          </Box>
        </Wrapper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
