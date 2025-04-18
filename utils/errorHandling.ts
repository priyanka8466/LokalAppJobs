// utils/errorHandling.ts
type ErrorWithMessage = {
    message: string;
    stack?: string;
  };
  
  function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    );
  }
  
  function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (isErrorWithMessage(maybeError)) return maybeError;
  
    try {
      return new Error(JSON.stringify(maybeError));
    } catch {
      // Fallback in case there's an error stringifying the maybeError
      return new Error(String(maybeError));
    }
  }
  
  export function getErrorMessage(error: unknown) {
    return toErrorWithMessage(error).message;
  }
  
  export function getErrorStack(error: unknown) {
    return toErrorWithMessage(error).stack;
  }