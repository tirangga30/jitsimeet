import { ErrorContainer, ErrorTitle, ErrorMessage, RetryButton } from './CallWarning.styles';

export const CallWarning = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <ErrorContainer>
      <ErrorTitle>Video Call Connection Issue</ErrorTitle>
      <ErrorMessage>
        The video call could not be established. Please check your internet connection or try
        joining again.
      </ErrorMessage>
      <RetryButton onClick={onRetry}>Retry</RetryButton>
    </ErrorContainer>
  );
};
