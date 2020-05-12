import { logger } from "react-native-logs";
import { consoleSync } from "react-native-logs/dist/transports/consoleSync";

const defaultConfig = {
  severity: "info",
  transport: consoleSync,
  transportOptions: null,
  levels: {
    error: 6,
    warn: 5,
    info: 4,
    http: 3,
    verbose: 2,
    debug: 1,
    silly: 0,
  },
};

// const customTransport: transportFunctionType = (msg, level, options) => {
//   // Do here whatever you want with the log message
//   // You cas use any options setted in config.transportOptions
//   // Eg. a console log: console.log(level.text, msg)
// };

var log = logger.createLogger(defaultConfig);

export const dbLogger = logger.createLogger(defaultConfig)
export const authLogger = logger.createLogger(defaultConfig)
export const networkLogger = logger.createLogger(defaultConfig)
export const appLogger = logger.createLogger(defaultConfig)

// navigation events
// handled errors?
