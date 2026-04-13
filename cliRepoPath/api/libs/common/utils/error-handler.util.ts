import { GraphQLFormattedError } from 'graphql';

export const formatGraphQLError = (formattedError: GraphQLFormattedError, _: unknown) => {
  // Handle specific HTTP exceptions
  if (isHttpException(formattedError)) {
    return handleHttpException(formattedError);
  }

  // Handle validation errors
  if (formattedError.extensions?.code === 'BAD_USER_INPUT') {
    return handleValidationError(formattedError);
  }

  if (formattedError.extensions?.code === 'BAD_REQUEST') {
    return handleBadRequestError(formattedError);
  }

  // Default to a generic error message for unexpected errors
  return handleGenericError(formattedError);
};

const isHttpException = (error: any): boolean => {
  const exception = error.extensions?.originalError;
  return (
    exception && typeof exception.statusCode === 'number' && typeof exception.message === 'string'
  );
};

const handleHttpException = (error: any) => {
  const httpException = error.extensions.originalError;
  const response = {
    statusCode: httpException.statusCode,
    message: httpException.message,
    error: httpException.error || 'Http Exception',
  };

  switch (httpException.statusCode) {
    case 400:
      return formatErrorResponse(
        httpException.message,
        'BAD_REQUEST',
        httpException.statusCode,
        response,
        'Bad Request',
      );
    case 401:
      return formatErrorResponse(
        httpException.message,
        'UNAUTHENTICATED',
        httpException.statusCode,
        response,
        'Unauthenticated',
      );
    case 403:
      return formatErrorResponse(
        httpException.message,
        'FORBIDDEN',
        httpException.statusCode,
        response,
        'Forbidden',
      );
    case 404:
      return formatErrorResponse(
        httpException.message,
        'NOT_FOUND',
        httpException.statusCode,
        response,
        'Not found',
      );
    case 500:
      return formatErrorResponse(
        httpException.message,
        'INTERNAL_SERVER_ERROR',
        httpException.statusCode,
        response,
        'Internal server error',
      );
    default:
      return formatErrorResponse(
        httpException.message,
        'HTTP_EXCEPTION',
        httpException.statusCode,
        response,
        'HTTP exception',
      );
  }
};

const handleValidationError = (error: any) => {
  return {
    message: 'Validation Error',
    extensions: {
      code: 'VALIDATION_ERROR',
      response: {
        statusCode: 400,
        message: error.message,
        error: 'Validation Error',
        details: error.extensions?.exception?.response?.message || [],
      },
    },
  };
};

const handleBadRequestError = (error: any) => {
  return {
    message: 'Validation Error',
    extensions: {
      code: 'VALIDATION_ERROR',
      response: {
        statusCode: 400,
        message: error.message,
        error: 'Validation Error',
        details: error.extensions?.originalError?.message || [],
      },
    },
  };
};

const handleGenericError = (error: any) => {
  return {
    message: error.message || 'Something went wrong.',
    extensions: {
      code: error.extensions.code || 'INTERNAL_SERVER_ERROR',
      response: {
        statusCode: 500,
        message: error.message || 'Something went wrong.',
        error: 'Internal Server Error',
      },
    },
  };
};

const formatErrorResponse = (
  message: string,
  errorCode: string,
  statusCode: number,
  response: any,
  errorTitle: string,
) => {
  return {
    message: message,
    extensions: {
      code: errorCode,
      response: {
        statusCode,
        message: response.message || message,
        error: errorTitle,
      },
    },
  };
};
