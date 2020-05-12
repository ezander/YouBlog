import { logger } from "react-native-logs";
import { consoleSync } from "react-native-logs/dist/transports/consoleSync";
import { ConfigAPI } from "@babel/core";
import  {createLogger as createReduxLogger} from "redux-logger"

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

// const customTransport: transportFunctionType = (msg, level, options) => {
//   // Do here whatever you want with the log message
//   // You cas use any options setted in config.transportOptions
//   // Eg. a console log: console.log(level.text, msg)
// };

function createConsoleLogger(name: string, severity: SeverityLevel) {
  const config = { ...defaultConfig, severity };

  const oldTransport = config.transport;
  config.transport = (msg, level, options) => {
    return oldTransport(name.toUpperCase().padEnd(4) + " | " + msg, level, options);
  };

  return logger.createLogger(config);
}

export const dbLogger = createConsoleLogger("DB", "info");
export const authLogger = createConsoleLogger("Auth", "info");
export const networkLogger = createConsoleLogger("Net", "info");
export const appLogger = createConsoleLogger("App", "info");

// navigation events
// handled errors?

const logReduxAction = ["noLOGIN", "noLOGOUT"]
export const ReduxLogger = createReduxLogger({
  logger: console, 
  level: "log",
  predicate: (getState: ()=>any, action: {type: string}) => logReduxAction.indexOf(action.type)>=0
})

