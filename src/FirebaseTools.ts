export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export enum ErrorType {
  INVALID_DATA,
  TEMPORARY_PROBLEM,
  INTERNAL_PROBLEM,
}

// Idea...
// "Cannot connect to server", ErrorType.TEMPORARY_PROBLEM, ["Retry later", "Check network settings"], "www.google.de"
// "Invalid request", ErrorType.INVALID_DATA, ["Check fields in your form"], {fields: "url"}
// "Division by zero", ErrorType, ["Inform developers of this error"]
// error: info + possible resolutions
// mayRetry, changeDataPossible, changeDataNecessary, needsCheck, informDevs
// "needs to close app", "may go back", "may try to retry", "should retry", "should retry after fixing"

interface ErrorInfo {
  title?: string;
  cause?: string;
  details?: string;
  resolutions?: string[];
  data?: any;
  rootError?: Error;
}

export class AppError extends Error {
  errorType: ErrorType;
  info: ErrorInfo;

  constructor(
    message: string,
    errorType: ErrorType = ErrorType.INTERNAL_PROBLEM,
    info: ErrorInfo = {}
  ) {
    super(message);
    this.info = info;
    this.errorType = errorType;
  }

  mayRetry() {
    return (
      this.errorType === ErrorType.INVALID_DATA ||
      this.errorType === ErrorType.TEMPORARY_PROBLEM
    );
  }
  mustChangeData() {
    return this.errorType === ErrorType.INVALID_DATA;
  }
  isProgrammerError() {
    return this.errorType === ErrorType.INTERNAL_PROBLEM;
  }
  title() {
    return this.info.title;
  }
  details() {
    return this.info.details;
  }
  resolutions() {
    return this.info.resolutions;
  }
  data() {
    return this.info.data;
  }
  rootError() {
    return this.info.rootError;
  }
}

export class FirebaseError extends AppError {
  // constructor(message: string, info?: any) {
  //     super(message)
  //     this.info = info
  // }
}

export class HTTPError extends AppError {}

export function parseError(error: any) {
  if (!error.isAxiosError) {
    return error;
  }
  const { response } = error;
  const { status, statusText } = response;

  if (status === 400) {
    const firebaseError = response.data.error;
    return new FirebaseError(firebaseError.message);
  } else {
    return new HTTPError(`${status} - ${statusText}`);
  }
}
