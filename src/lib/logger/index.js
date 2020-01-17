import winston from 'winston';

const {
  createLogger, format, transports, config,
} = winston;
export const Logger = ({ level, isDisabled }) => {
  const configuredTransports = [];
  const exceptionHandlers = [];
  let logger;

  if (isDisabled) {
    logger = createLogger({ format: format.simple(), silent: true });
    console.info('logger is disabled by configuration');
  } else {
    const configuredFormat = format.json();
    // console transport
    const consoleTransport = new transports.Console({
      format: format.simple(),
      consoleWarnLevels: ['warn'],
      stderrLevels: ['error'],
    });

    configuredTransports.push(consoleTransport);
    exceptionHandlers.push(consoleTransport);

    logger = createLogger({
      level,
      levels: config.npm.levels,
      format: configuredFormat,
      transports: configuredTransports,
      exceptionHandlers,
      exitOnError: false,
    });
    configuredTransports.forEach(transport => winston.add(transport));
  }

  return logger;
};

export default Logger;
