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

const errorMapping = {
  // "EMAIL_NOT_FOUND": "Email address not found",
  // "INVALID_PASSWORD": "The supplied password was not correct.",
  // "USER_DISABLED": "The user is disabled. Please contact an administrator"

  CREDENTIAL_TOO_OLD_LOGIN_AGAIN:
    "The user's credential is no longer valid. The user must sign in again.",
  EMAIL_EXISTS: "The email address is already in use by another account.",
  EMAIL_NOT_FOUND:
    "There is no user record corresponding to this identifier. The user may have been deleted.",
  EXPIRED_OOB_CODE: "The action code has expired.",
  FEDERATED_USER_ID_ALREADY_LINKED:
    "This credential is already associated with a different user account.",
  INVALID_CUSTOM_TOKEN:
    "The custom token format is incorrect or the token is invalid for some reason (e.g. expired, invalid signature etc.)",
  INVALID_EMAIL: "The email address is badly formatted.",
  INVALID_GRANT_TYPE: "the grant type specified is invalid.",
  INVALID_ID_TOKEN:
    "The user's credential is no longer valid. The user must sign in again.",
  INVALID_IDP_RESPONSE:
    "The supplied auth credential is malformed or has expired.",
  INVALID_OOB_CODE:
    "The action code is invalid. This can happen if the code is malformed, expired, or has already been used.",
  MISSING_PASSWORD:
    "The password was missing from the request.",
  INVALID_PASSWORD:
    "The password is invalid or the user does not have a password.",
  INVALID_REFRESH_TOKEN: "An invalid refresh token is provided.",
  MISSING_REFRESH_TOKEN: "no refresh token provided.",
  OPERATION_NOT_ALLOWED: "Anonymous user sign-in is disabled for this project.",
  // "OPERATION_NOT_ALLOWED": "Password sign-in is disabled for this project.",
  // "OPERATION_NOT_ALLOWED": "The corresponding provider is disabled for this project.",
  TOKEN_EXPIRED:
    "The user's credential is no longer valid. The user must sign in again.",
  TOO_MANY_ATTEMPTS_TRY_LATER:
    "We have blocked all requests from this device due to unusual activity. Try again later.",
  USER_DISABLED: "The user account has been disabled by an administrator.",
  // "USER_NOT_FOUND": "The user corresponding to the refresh token was not found. It is likely the user was deleted.",
  USER_NOT_FOUND:
    "There is no user record corresponding to this identifier. The user may have been deleted.",
  WEAK_PASSWORD: "The password must be 6 characters long or more.",
};

export function parseError(error: any) {
  if (!error.isAxiosError) {
    return error;
  }
  const { response } = error;
  const { status, statusText } = response;

  if (400<=status && status < 500) {
    const firebaseError = response.data.error;

    const origMessage = firebaseError.message as string
    // @ts-ignore
    const message = (origMessage in errorMapping) ? errorMapping[origMessage] : origMessage

    return new FirebaseError(message, undefined, {rootError: response.data.error});
  } else {
    return new HTTPError(`${status} - ${statusText}`);
  }
}
