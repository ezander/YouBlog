import { logger } from "react-native-logs";
import { consoleSync } from "react-native-logs/dist/transports/consoleSync";
// @ts-ignore
import { createLogger as createReduxLogger } from "redux-logger";

const severityLevels = {
  error: 6,
  warn: 5,
  info: 4,
  http: 3,
  verbose: 2,
  debug: 1,
  silly: 0,
};
type SeverityLevel = keyof typeof severityLevels;

const defaultConfig = {
  severity: "info",
  transport: consoleSync,
  transportOptions: null,
  levels: severityLevels,
};

function createConsoleLogger(name: string, severity: SeverityLevel) {
  const config = { ...defaultConfig, severity };

  const oldTransport = config.transport;
  config.transport = (msg, level, options) => {
    return oldTransport(
      name.toUpperCase().padEnd(4) + " | " + msg,
      level,
      options
    );
  };

  return logger.createLogger(config);
}

export const dbLogger = createConsoleLogger("DB", "info");
export const authLogger = createConsoleLogger("Auth", "info");
export const networkLogger = createConsoleLogger("Net", "info");
export const appLogger = createConsoleLogger("App", "info");

// navigation events
// handled errors?

const logReduxAction: string[] = [
  // "SET_POST"
  // "LOGIN",
  // "LOGOUT",
];
const selectActionsPredicate = (
  getState: () => any,
  action: { type: string }
) => logReduxAction.indexOf(action.type) >= 0;
const selectAllPredictate = (getState: () => any, action: { type: string }) =>
  true;
const selectNonePredictate = (getState: () => any, action: { type: string }) =>
  false;

function replacer(key: string, value: any) {
  // Filtering out properties
  if (typeof value === "string" && value.length > 50) {
    return value.slice(0, 50) + "...";
  }
  return value;
}
const JSONStateTransformer = (state: any) =>
  JSON.stringify(state, replacer, "  ");
const JSONActionTransformer = (action: any) =>
  JSON.stringify(action, replacer, "  ");

export const ReduxLogger = createReduxLogger({
  logger: console,
  level: "log",
  stateTransformer: (state: any) => ({}),
  actionTransformer: (action: any) => action.type,
  //action => ({type: "FOO", payload: "Transformed action"}), //JSON.stringify(state, replacer),

  predicate: selectNonePredictate,
});
