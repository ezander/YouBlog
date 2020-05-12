import { logger } from "react-native-logs";
import { consoleSync } from "react-native-logs/dist/transports/consoleSync";
import { ConfigAPI } from "@babel/core";

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

function createLogger(name: string, severity: SeverityLevel) {
  const config = { ...defaultConfig, severity };

  const oldTransport = config.transport;
  config.transport = (msg, level, options) => {
    return oldTransport(name.toUpperCase() + " | " + msg, level, options);
  };

  return logger.createLogger(config);
}

export const dbLogger = createLogger("DB", "info");
export const authLogger = createLogger("Auth", "info");
export const networkLogger = createLogger("Net", "info");
export const appLogger = createLogger("App", "info");

// navigation events
// handled errors?
